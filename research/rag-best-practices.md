# 高校数字资产管理系统 - RAG 最佳实践研究

> 需求：对PPT、PDF、Word等文档进行向量化处理，结合大模型实现检索和总结

---

## 🎯 推荐的技术栈

### 核心框架（选一个）

| 项目 | Stars | 特点 | 推荐度 |
|------|-------|------|--------|
| **LlamaIndex** | 46.7K | 专门为 RAG 设计，文档处理能力强 | ⭐⭐⭐⭐⭐ |
| **LangChain** | 125.8K | 最流行，生态丰富 | ⭐⭐⭐⭐⭐ |
| **Haystack** | 24K | 企业级，支持多种文件格式 | ⭐⭐⭐⭐ |
| **Quivr** | 38.9K | 开箱即用，自带UI | ⭐⭐⭐⭐ |

**推荐：LlamaIndex 或 LangChain**

---

## 📁 文档处理

### 多格式文档解析

| 项目 | Stars | 支持格式 | 说明 |
|------|-------|----------|------|
| **spacy-layout** | 848 | PDF, Word | Explosion 出品，质量高 |
| **MMORE** | 185 | PDF, 视频, 表格 | 多模态，可处理8000+ PDF |
| **pdf-to-markdown** | 107 | PDF → Markdown | 保留格式，适合 RAG |
| **SmartRAG** | 107 | PDF, Word, 音频 | 本地处理，隐私优先 |

### 企业级方案

| 项目 | Stars | 特点 |
|------|-------|------|
| **Azure GPT-RAG-Ingestion** | 162 | 处理 PDF、图片、表格，生成向量嵌入 |
| **Tencent WeKnora** | 12.8K | 腾讯出品，深度文档理解 |
| **DB-GPT** | 18K | 数据库+AI，中文友好 |

---

## 🗄️ 向量数据库

| 数据库 | 特点 | 推荐场景 |
|--------|------|----------|
| **Milvus** | 开源，高性能 | 大规模数据 |
| **Qdrant** | Rust 写的，快 | 中小规模 |
| **Chroma** | 简单易用 | 快速原型 |
| **PGVector** | PostgreSQL 插件 | 已有 PG 数据库 |
| **FAISS** | Meta 出品 | 纯本地 |

---

## 🏗️ 推荐架构

```
用户上传文档 (PPT/PDF/Word)
         ↓
    文档解析层
    - spacy-layout / Unstructured
    - 提取文本、表格、图片
         ↓
    文本分块 (Chunking)
    - 按语义分块
    - 保留上下文
         ↓
    向量嵌入 (Embedding)
    - OpenAI text-embedding-3
    - 或本地模型 (bge-large-zh)
         ↓
    向量存储
    - Milvus / Qdrant / PGVector
         ↓
    检索 + 生成
    - LlamaIndex / LangChain
    - GPT-4 / Claude / 通义千问
         ↓
    返回答案 + 引用来源
```

---

## 🎓 适合高校场景的项目

### 1. Quivr (38.9K Stars)
```
https://github.com/QuivrHQ/quivr
```
- ✅ 开箱即用，自带 Web UI
- ✅ 支持 PDF、Word、PPT
- ✅ 多种 LLM 支持
- ✅ Docker 一键部署
- 适合：快速搭建原型

### 2. LlamaIndex + Qdrant
```
https://github.com/run-llama/llama_index
```
- ✅ 灵活性高
- ✅ 文档处理能力强
- ✅ 中文支持好
- 适合：定制化需求

### 3. DB-GPT (18K Stars)
```
https://github.com/eosphoros-ai/DB-GPT
```
- ✅ 中国团队开发
- ✅ 中文文档
- ✅ 数据库 + AI 一体化
- 适合：需要数据库集成

### 4. LearnAI (教育专用)
```
https://github.com/manvirchakal/LearnAI
```
- ✅ 专为教育设计
- ✅ 处理教材和 PDF
- ✅ 生成个性化学习内容
- 适合：教育场景

---

## 💡 关键技术点

### 1. 文档解析
```python
# 使用 Unstructured 库
from unstructured.partition.auto import partition

elements = partition(filename="创业计划书.pdf")
```

### 2. 中文嵌入模型
```python
# 推荐 bge-large-zh-v1.5
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('BAAI/bge-large-zh-v1.5')
```

### 3. 智能分块
```python
# 按语义分块，保留上下文
from llama_index.core.node_parser import SemanticSplitterNodeParser
splitter = SemanticSplitterNodeParser(
    buffer_size=1,
    breakpoint_percentile_threshold=95,
    embed_model=embed_model
)
```

---

## 🚀 快速开始建议

### 阶段一：原型验证
1. 用 **Quivr** 快速搭建
2. 上传几个典型文档测试
3. 验证检索效果

### 阶段二：定制开发
1. 选择 **LlamaIndex** 作为核心框架
2. 使用 **Milvus** 作为向量数据库
3. 接入 **通义千问** 或 **GPT-4** 作为 LLM

### 阶段三：生产部署
1. Docker 容器化
2. 添加用户权限管理
3. 支持批量上传
4. 添加文档分类

---

## 📚 学习资源

1. LlamaIndex 官方教程：https://docs.llamaindex.ai
2. LangChain RAG 教程：https://python.langchain.com/docs/tutorials/rag
3. Quivr 快速开始：https://docs.quivr.app

---

*研究整理：powerA / Voltex*
*日期：2026-02-04*
