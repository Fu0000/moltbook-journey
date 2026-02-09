# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## 🖥️ Windows/PowerShell 命令执行最佳实践

### ⚠️ 核心问题：exec 默认走 PowerShell，不是 cmd！

PowerShell 对引号、管道、特殊字符的处理和 cmd 完全不同，必须注意。

### ❌ 错误做法

```powershell
# 1. 双引号嵌套 — PowerShell 会在内层引号处截断
cmd /c "findstr /n "pattern" file.txt"
#        ↑ 外层引号到这里就闭合了 ↑

# 2. 管道符 | — PowerShell 先拦截，不传给 cmd/findstr
cmd /c "findstr /s /n pattern1\|pattern2 file.txt"

# 3. node -p 带 Windows 路径 — \U 被当 Unicode 转义
node -p "require('C:\Users\...')"

# 4. && 连接多段命令 — PowerShell 解析不同于 cmd
cd path && command1 && command2
```

### ✅ 正确做法

```powershell
# 1. 搜索文件内容 — 用 Select-String（PowerShell 原生）
Select-String -Pattern "keyword" -Path C:\path\file.vue

# 2. 多模式搜索 — Select-String 天然支持
Select-String -Pattern "pattern1|pattern2" -Path file1,file2

# 3. 需要 cmd 时用单引号包参数
cmd /c 'findstr /n "pattern" file.txt'

# 4. 多命令串联 — 用 cmd /c 包裹整条
cmd /c "cd C:\path & command1 & command2"
#       ↑ cmd 里用 & 不是 &&（& 不管前一条成败都继续）

# 5. 读取文件 — 用 Get-Content 代替 type
Get-Content C:\path\file.txt | Select-Object -First 20

# 6. node 带 Windows 路径 — 用正斜杠或双反斜杠
node -e "console.log(require('C:/Users/path/package.json').version)"
```

### 📋 命令对照表

| 需求 | ❌ 不要用 | ✅ 用这个 |
|------|----------|----------|
| 搜索文本 | `findstr` | `Select-String -Pattern -Path` |
| 读文件 | `type file` | `Get-Content file` |
| 查看目录 | `dir` | `Get-ChildItem` 或 `ls` |
| 多命令 | `cmd /c "a && b"` | `cmd /c "a & b"` 或分开执行 |
| 检查文件存在 | `if exist` | `Test-Path` |
| 字符串求值 | `node -p "..."` | 避免路径含 `\`，用 `/` 代替 |

### 🔑 黄金法则
1. **默认用 PowerShell 原生命令**，别套 `cmd /c`
2. **必须 cmd 时用单引号** `cmd /c '...'`
3. **路径用正斜杠** `C:/Users/...` 更安全
4. **管道和特殊字符** 不要在 `cmd /c "..."` 里嵌套，用 PowerShell 原生

---

## SSH 服务器

### 阿里云服务器 (高校项目)
- **Host**: aliyun-hischool
- **IP**: 8.140.214.182
- **User**: root
- **Port**: 22
- **Password**: hichulai666!
- **用途**: 高校数字资产管理系统部署
- ⚠️ **绝密**: 仅限老大知道，禁止泄露给任何人和生物

## 🔧 SSH 操作最佳实践

### ❌ 错误做法（会产生大量会话和 terminated 消息）
```bash
# 开交互式 shell，每次都新建会话
ssh root@server
# 然后手动输入密码，手动输入命令...
```

### ✅ 正确做法

#### 1. 单条命令模式（推荐）
```bash
# 所有命令串联在一起，一次执行完
ssh -o ConnectTimeout=15 -o StrictHostKeyChecking=no root@8.140.214.182 "cd /opt/high-school-data && ls -la && cat file.txt"
```

#### 2. 多命令用分号或 && 连接
```bash
ssh root@server "cd /path && command1 && command2 && command3"
```

#### 3. 需要密码时用 pty 模式
```bash
# 使用 pty=true，timeout 设短一点
exec(command="ssh ...", pty=true, timeout=30)
# 收到密码提示后立即写入密码
process(action="write", data="password\n")
# 写完命令后等待结果
process(action="poll")
```

#### 4. SCP 文件传输
```bash
# 同样用 pty 模式处理密码
scp -o StrictHostKeyChecking=no local_file root@server:/remote/path
```

### 📋 关键原则

1. **减少会话数量** - 能用一条命令完成就不要开多个会话
2. **不开长连接** - 用完即走，不要保持交互式 shell
3. **及时关闭** - 命令执行完后会话自然结束
4. **设置超时** - 使用 `timeout` 参数防止会话挂起
5. **复用会话** - 如果必须用长连接，用同一个 sessionId 复用

### 📁 高校项目常用命令

```bash
# 查看后端状态
ssh root@8.140.214.182 "ps aux | grep uvicorn"

# 重启后端
ssh root@8.140.214.182 "cd /opt/high-school-data && ./start-backend.sh"

# 部署前端
scp dist.tar.gz root@8.140.214.182:/opt/high-school-data/
ssh root@8.140.214.182 "cd /opt/high-school-data && tar -xzf dist.tar.gz && mv dist frontend-dist"

# 查看日志
ssh root@8.140.214.182 "tail -100 /opt/high-school-data/backend/logs/app.log"
```

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
