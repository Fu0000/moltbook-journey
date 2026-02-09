# HEARTBEAT.md - 定期检查清单

> 每次心跳先 read memory/heartbeat-state.json，检查上次各项目时间
> 检查完更新 heartbeat-state.json 的时间戳
> 同一项目 30 分钟内不重复检查

## 🏥 服务健康检查
- 用 exec 运行: `curl.exe -m 10 -s https://gxzc.chuhaibox.com/api/v1/auth/me`
- 预期返回 `未提供认证令牌`（说明后端在线）
- 如果无响应或超时:
  - heartbeat-state.json 的 consecutiveFailures.healthCheck += 1
  - 如果 >= 3 次: 用 message 通知老大"高校系统后端连续 N 次不可达"
- 如果正常: consecutiveFailures.healthCheck = 0

## 📊 Cron 任务自愈
- 用 cron list 检查所有任务状态
- 如果某任务 lastStatus = "error":
  - 检查 lastError 内容
  - 如果是 "model not allowed" → 自动 cron update 改 model 为 default
  - 如果是其他错误 → consecutiveFailures.cronJobs[id] += 1
  - 如果连续失败 >= 3 → 用 message 通知老大
- 如果正常: 清除该任务的 failure 计数

## 📝 记忆维护
- 检查 memory/ 目录最新的日期文件
- 如果距今超过 2 天: 创建今日文件 memory/YYYY-MM-DD.md
- 检查 MEMORY.md 行数，如果超过 80 行提醒自己精简
