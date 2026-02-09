# 技术经验与工具备忘

## 💻 开发环境
- **GitHub 用户**: Fu0000
- **SSH 密钥**: ~/.ssh/id_ed25519 (powerA-openclaw)
- **OpenCode**: v1.1.49 已安装

## ⚠️ PowerShell 坑
- 不支持 `&&`/`||` → 用 `cmd /c` 包装
- 不支持多行 git commit → 用 `git commit -F file.txt`
- findstr 不支持 `|` 管道正则 → 分开查

## 📦 Node.js
- vue-tsc 在 Node v24 有兼容性问题 → 直接 `npx vite build` 跳过类型检查
- Vite 循环 chunk 依赖是硬阻塞 → Element Plus 不要拆分成多个 chunk

## 🐍 Python 部署
- 部署前验证: `python3.11 -c "from app.main import app"`
- 改 .py 后清缓存: `find . -name "__pycache__" -exec rm -rf {} +`
- sed 改 Python 不靠谱 → 直接写文件 SCP 上传
- sed 多行不可靠 → 用 Python `re.sub`

## 🤖 Sub-Agent 管理
- 8+ 并行会触发 429 rate limits → 分批 spawn
- opus 模型的 sub-agent 容易超时（想太多）→ 给预消化信息 + 直接写
- 子 agent 任务必须验收: git log 对比需求清单
- SQLAlchemy Index() comment 参数是 sub-agent 常犯错误

## 🔐 SSH 最佳实践
- 单条命令: `ssh root@server "cmd1 && cmd2"`
- 需要密码: pty=true → write 密码 → poll 结果
- 不开长连接, 用完即走
- 设置 timeout 防挂起
