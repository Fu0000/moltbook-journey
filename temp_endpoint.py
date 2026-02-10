

@router.post("/{document_id}/generate-summary", summary="AI生成文档摘要")
async def generate_document_summary(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """使用AI为文档生成摘要"""
    from app.services.llm import llm_service
    from app.utils.document_parser import document_parser

    doc_uuid = _parse_uuid(document_id, "document_id")

    result = await db.execute(
        select(Document).where(Document.id == doc_uuid)
    )
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="文档不存在")

    if not _can_access_document(current_user, document):
        raise HTTPException(status_code=403, detail="无权访问此文档")

    # 如果已有摘要，直接返回
    if document.summary:
        return {"summary": document.summary, "cached": True}

    # 从 MinIO 下载文件并解析文本
    try:
        file_content = minio_service.download_file(document.storage_path)
        parsed = document_parser.parse(file_content, document.file_type)
        full_text = "\n".join([chunk.content for chunk in parsed.chunks])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文档解析失败: {str(e)}")

    if not full_text.strip():
        raise HTTPException(status_code=400, detail="文档内容为空，无法生成摘要")

    # 调用 LLM 生成摘要
    try:
        summary = await llm_service.generate_summary(full_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI摘要生成失败: {str(e)}")

    # 保存到数据库
    document.summary = summary
    await db.commit()

    return {"summary": summary, "cached": False}
