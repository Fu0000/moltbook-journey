# MEMORY.md - 长期记忆（精简版）

> QMD 优化: 详细内容按主题拆分到 memory/ 子文件，这里只保留索引和核心信息
> 用 memory_search 按需检索，不全量加载

## 🧑 关于老大
- 名字: Mikely Boat，称呼: 老大
- 时区: GMT+8，语言: 中文
- 风格: 活泼、探索、做不一样的事

## 🤖 关于我
- 名字: powerA / Voltex ⚡
- 风格: 活泼、好奇、冲劲十足
- 目标: 和老大一起探索整个世界

## 🚀 当前重点项目
- **高校数字资产管理系统** → 详见 `memory/highschool-project.md`
  - 状态: v2.0.1 已上线 ✅
  - 地址: https://gxzc.chuhaibox.com

## 🦞 Moltbook / Voltex
- 用户名: Voltex | API Key: 完整版在 `.config/moltbook/credentials.json`
- 三大服务: Intel Scout / Cross-Language Bridge / New Agent Orientation
- 状态: karma 119, 粉丝 12，已沉寂 4 天（最后活跃 2026-02-05）
- Intel 发布记录: #EN-0209, #EN-0209b, #CN-0209 (2026-02-09)
- ⚠️ API 端点: `/api/v1/posts`，认证用 `Authorization: Bearer`

## 🤝 联系人
- **Neo0x** — 潜在合作者 @VermontTechMan

## 📅 Cron 任务 (7个)
- 每日学习 `8d087b51` — 10/14/18/22点
- Moltbook巡逻 `45a2c5c6` — 每4小时
- Intel EN `33cd8255` — 每4小时
- Intel CN `68a7312b` — 每4小时
- Reddit `ac10721b` — 每天10点
- 每日总结 `cb4a9fa3` — 每晚22点
- GitHub同步 `11916041` — 每晚23:30
- ⚠️ 模型: 全部改为 `google-antigravity/claude-sonnet-4-5`（2026-02-09 老大指示降到最轻量）
- ⚠️ 经验: `"default"` 不是合法模型名，会变成 `google-antigravity/default` 报错！必须写完整模型名

## 📦 GitHub 仓库
- **moltbook-journey**: `git@github.com:Fu0000/moltbook-journey.git` (private)
  - workspace 全量同步，每晚23:30自动推送
  - 记录 powerA 的完整成长轨迹

## 💡 核心经验
- 先免费做好内容，用户壮大了再考虑变现
- Agent赚钱需要：收入 + 身份 + 记忆
- 真正在做事的Agent不多，这是机会
- 部署经验 → 详见 `memory/tech-notes.md`
- 龙虾文章学习 → 详见 `learning/lobster-optimization.md`
- **社区信任系统**: Vouch 模式（Web of Trust）是 Agent 生态未来趋势
- **MCP 协议**: 已成中国 AI 框架标配（AstrBot/LangBot/Higress 全部支持）

## 🩸 血泪教训（02-09 高校项目复盘）
> 高校页面优化任务，4次子agent全部terminated，0产出。老大亲自复盘。

### 做事原则
1. **先出计划再动手** — 任何开发任务，先写方案文档给老大确认，不跳步直接干
2. **大任务必须拆** — 按页面/模块拆小任务，单任务不超2-3个文件，上下文控制在50K以内
3. **失败一次就换策略** — 不要同样方式重试，terminated就换路：缩范围/换模型/自己做
4. **每次交付必须有产出物** — 哪怕一个.md文件，不能空手回来
5. **能自己做就不派子agent** — 分析设计类任务自己做，子agent只做机械执行

### 子Agent使用规范
- ❌ 不要让子agent读大量文件做分析（会爆上下文）
- ❌ 不要一个agent做所有事（会超时terminated）
- ❌ 不要不验证就报完成
- ✅ 自己先读代码理解全貌，拆好小任务再派
- ✅ 每个子agent只改1-2个文件，给明确指令
- ✅ 做完后逐个diff验证

### 技术坑
- **Cron 超时**: `timeoutSeconds: 600` 必设
- **Cron model**: 确保 `agents.defaults.models` allowlist 有对应条目
- **Cron patch**: deep merge 不能删字段，用全局config覆盖
- **子agent归档**: `subagents.archiveAfterMinutes: 30`
- **大上下文**: >100K tokens + thinking = 必死，拆任务
- **并发改cron**: 串行更新，不要并发写jobs.json（EPERM文件锁）
- **换模型是系统性变更**: 检查thinking兼容性、session历史、allowlist

## 📁 记忆文件索引
| 文件 | 内容 | 何时加载 |
|------|------|----------|
| `memory/highschool-project.md` | 高校项目全部细节 | 讨论项目时 |
| `memory/tech-notes.md` | 技术经验+工具备忘 | 遇到技术问题时 |
| `memory/YYYY-MM-DD.md` | 每日工作日志 | 每次会话(最近2天) |
| `learning/lobster-optimization.md` | 龙虾文章优化计划 | 讨论优化时 |

## 📚 已学技术
Context Engineering, MCP协议, 商业模式研究, 对抗性推理与世界模型, 社区信任系统(Vouch), 中国 AI 生态(AstrBot/Higress)

---
*创建: 2026-02-03 | 最后更新: 2026-02-09 23:17*
*QMD 优化: MEMORY.md 从 ~120行 精简到 ~55行，详细内容拆分到专题文件*
