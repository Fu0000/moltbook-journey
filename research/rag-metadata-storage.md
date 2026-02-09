# 高校数字资产管理系统 - 文件溯源与元数据存储方案

> 补充：返回原文件信息 + 对象存储元数据

---

## 🎯 核心需求

1. **检索答案时能追溯到原文件**
   - 显示来源文件名
   - 显示具体页码/章节
   - 支持点击查看原文

2. **元数据管理**
   - 文件类型、大小、上传时间
   - 作者、分类、标签
   - 文件关联关系

3. **原文件存储**
   - 保留原始文件
   - 支持在线预览
   - 支持下载

---

## 🏗️ 完整架构

```
┌─────────────────────────────────────────────────────────────┐
│                     用户界面层                                │
│  上传文档 | 搜索问答 | 查看原文 | 下载文件                      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     应用服务层                                │
│  文档处理服务 | RAG检索服务 | 文件预览服务                     │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   向量数据库    │    │   元数据库     │    │   对象存储     │
│   (Milvus)    │    │  (PostgreSQL) │    │   (MinIO)     │
│               │    │               │    │               │
│ - 文本向量     │    │ - 文件信息     │    │ - 原始文件     │
│ - chunk_id    │    │ - 分块映射     │    │ - 预览图      │
│ - doc_id      │    │ - 用户权限     │    │ - 缩略图      │
└───────────────┘    └───────────────┘    └───────────────┘
```

---

## 📦 对象存储方案

### 推荐：MinIO (自建) 或 阿里云 OSS

| 方案 | 特点 | 适用场景 |
|------|------|----------|
| **MinIO** | 开源、S3兼容、可自建 | 校内部署、数据安全要求高 |
| **阿里云 OSS** | 托管、稳定、便宜 | 快速上线、运维简单 |
| **腾讯云 COS** | 托管、国内访问快 | 备选 |

### MinIO 部署
```bash
# Docker 一键部署
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  -v /data/minio:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=password" \
  minio/minio server /data --console-address ":9001"
```

---

## 🗄️ 元数据表设计

### 1. 文档表 (documents)
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),           -- pdf, docx, pptx
    file_size BIGINT,
    storage_path VARCHAR(500),       -- MinIO 路径
    upload_time TIMESTAMP,
    uploader_id UUID,
    
    -- 业务元数据
    title VARCHAR(255),
    author VARCHAR(100),
    category VARCHAR(100),           -- 创业计划书、教学案例、比赛策划
    tags TEXT[],                     -- 标签数组
    description TEXT,
    
    -- 处理状态
    process_status VARCHAR(50),      -- pending, processing, completed, failed
    chunk_count INT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. 文档分块表 (document_chunks)
```sql
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY,
    document_id UUID REFERENCES documents(id),
    chunk_index INT,                 -- 分块序号
    content TEXT,                    -- 分块文本
    
    -- 定位信息（用于溯源）
    page_number INT,                 -- 页码
    section_title VARCHAR(255),      -- 章节标题
    start_char INT,                  -- 起始字符位置
    end_char INT,                    -- 结束字符位置
    
    -- 向量 ID（关联 Milvus）
    vector_id VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. 分类表 (categories)
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    parent_id UUID,                  -- 支持层级分类
    description TEXT
);

-- 预设分类
INSERT INTO categories (id, name) VALUES
    (gen_random_uuid(), '创业计划书'),
    (gen_random_uuid(), '优秀教师案例'),
    (gen_random_uuid(), '比赛策划'),
    (gen_random_uuid(), '教学课件'),
    (gen_random_uuid(), '学术论文');
```

---

## 🔍 检索结果返回格式

### API 响应示例
```json
{
    "answer": "根据《2024年互联网+创业计划书》中的分析，市场规模预计达到500亿...",
    "sources": [
        {
            "document_id": "uuid-1234",
            "filename": "互联网+创业计划书.pdf",
            "title": "2024年互联网+创业计划书",
            "category": "创业计划书",
            "author": "张三",
            "page_number": 15,
            "section": "第三章 市场分析",
            "relevance_score": 0.92,
            "snippet": "...市场规模预计达到500亿元，年增长率保持在25%以上...",
            "preview_url": "/api/documents/uuid-1234/preview?page=15",
            "download_url": "/api/documents/uuid-1234/download"
        },
        {
            "document_id": "uuid-5678",
            "filename": "市场调研报告.docx",
            ...
        }
    ],
    "total_sources": 3
}
```

---

## 📄 文件预览方案

### 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| **pdf.js** | 开源、前端渲染 | 只支持 PDF |
| **Office Online** | 微软官方、效果好 | 需要公网访问 |
| **OnlyOffice** | 开源、支持多格式 | 需要部署 |
| **LibreOffice + unoconv** | 转换为 PDF | 需要安装 |

### 推荐：OnlyOffice Document Server
```bash
# Docker 部署
docker run -d \
  -p 8080:80 \
  --name onlyoffice \
  onlyoffice/documentserver
```

---

## 💻 代码示例

### 上传并处理文档
```python
from minio import Minio
from llama_index.core import Document
from sqlalchemy.orm import Session

async def upload_document(file, db: Session, minio_client: Minio):
    # 1. 上传到 MinIO
    file_path = f"documents/{uuid4()}/{file.filename}"
    minio_client.put_object(
        bucket_name="assets",
        object_name=file_path,
        data=file.file,
        length=file.size
    )
    
    # 2. 保存元数据到 PostgreSQL
    doc = Document(
        filename=file.filename,
        file_type=file.content_type,
        file_size=file.size,
        storage_path=file_path,
        process_status="pending"
    )
    db.add(doc)
    db.commit()
    
    # 3. 异步处理文档（Celery 任务）
    process_document.delay(doc.id)
    
    return doc
```

### 检索并返回来源
```python
from llama_index.core import VectorStoreIndex

async def search_with_sources(query: str, db: Session):
    # 1. 向量检索
    results = vector_index.query(query, top_k=5)
    
    # 2. 获取来源信息
    sources = []
    for node in results.source_nodes:
        chunk = db.query(DocumentChunk).filter_by(
            vector_id=node.id_
        ).first()
        
        doc = db.query(Document).filter_by(
            id=chunk.document_id
        ).first()
        
        sources.append({
            "document_id": str(doc.id),
            "filename": doc.filename,
            "title": doc.title,
            "category": doc.category,
            "page_number": chunk.page_number,
            "section": chunk.section_title,
            "snippet": chunk.content[:200],
            "preview_url": f"/api/documents/{doc.id}/preview?page={chunk.page_number}",
            "download_url": f"/api/documents/{doc.id}/download"
        })
    
    return {
        "answer": results.response,
        "sources": sources
    }
```

---

## 🚀 技术栈总结

| 组件 | 推荐方案 |
|------|----------|
| **框架** | FastAPI + LlamaIndex |
| **向量库** | Milvus |
| **元数据库** | PostgreSQL |
| **对象存储** | MinIO (自建) 或 阿里云 OSS |
| **文件预览** | OnlyOffice / pdf.js |
| **任务队列** | Celery + Redis |
| **前端** | Vue3 / React |

---

## 📋 下一步

1. [ ] 确定部署环境（云服务器 / 校内服务器）
2. [ ] 选择对象存储方案（MinIO / OSS）
3. [ ] 设计详细的 API 接口
4. [ ] 开始原型开发

---

*研究整理：powerA / Voltex*
*日期：2026-02-04*
