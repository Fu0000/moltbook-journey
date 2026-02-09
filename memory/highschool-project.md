# 高校数字资产管理系统 - 项目记忆

## 📌 基本信息
- **GitHub**: https://github.com/Fu0000/high-school-data-manage
- **访问**: https://gxzc.chuhaibox.com
- **账号**: admin / admin123
- **服务器**: root@8.140.214.182 (密码在 TOOLS.md)
- **项目路径**: /opt/high-school-data/

## 🏗️ 技术栈
- **后端**: FastAPI + python3.11 + SQLAlchemy async
- **前端**: Vue3 + Element Plus + Vite
- **存储**: PostgreSQL (Docker: hischool-postgres) + MinIO + Milvus
- **部署**: systemd (`highschool-api.service`) + nginx

## 📊 检索架构
```
查询 → [Vector + BM25] → RRF Fusion → BGE Reranker → 结果
```
- Embedding: MiniLM-L12 (384维)
- Reranker: BAAI/bge-reranker-base
- 搜索模式: keyword / vector / hybrid / smart ⭐
- 性能: 首次 ~2min (加载模型), 后续 ~4s

## 🤖 LLM 配置
- Provider: Codex (GPT-5.3-codex)
- API: yunyi.cfd/codex (Responses API, stream=true)
- 用途: AI 文档摘要 + RAG 对话

## 📡 服务配置
- **DATABASE_URL**: postgresql+asyncpg://postgres:hischool2026@127.0.0.1:5432/asset_manage?ssl=disable
- **Nginx**: /etc/nginx/conf.d/hischool.conf (HTTPS+SSL, SPA fallback)
- **uvicorn**: 2 workers + timeout-keep-alive 120
- **前端路径**: /opt/high-school-data/frontend-dist/

## 📈 版本历史
- v1.0: 基础文档管理 + 向量搜索
- v2.0 (2026-02-08): 67文件 +5405行, 9模块升级
  - Dashboard, 收藏, 标签, 通知, 审核, 学院扩充, CI/CD
- v2.0.1 (2026-02-08~09): Bug 修复
  - chat.py: sources → context_docs
  - documents.py: pending-review 路由顺序
  - vite.config.ts: Element Plus 单 chunk
  - Upload.vue: 向量化进度弹窗
  - request.ts: 超时 30s → 120s
  - CI: 简化, deploy 改手动

## 🔧 部署经验教训
- PostgreSQL 在 Docker 里, 执行 SQL: `docker cp → docker exec psql`
- Python 必须用 `python3.11`
- SSH nohup+& 不可靠 → 用 systemd
- 部署前必须验证导入: `python3.11 -c "from app.main import app"`
- 改 .py 后清 __pycache__: `find . -name "__pycache__" -exec rm -rf {} +`
- DATABASE_URL 必须用 127.0.0.1（外部 IP 被安全组拦截）
- MinIO SECURE 必须 true（服务端是 HTTPS）
- SQLAlchemy Index() 不支持 comment 参数
- sed 不适合改 Python 代码 → 直接写文件 SCP 上传
- tar 覆盖陷阱: 确保 tar 包是最终版本
