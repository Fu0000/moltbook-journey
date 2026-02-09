# 📚 工作区索引 (Workspace Index)

> 渐进式披露：不全部加载，按需检索

---

## 🗂️ 目录结构

```
workspace/
├── INDEX.md              ← 你在这里（主索引）
├── MEMORY.md             ← 长期记忆（精简索引，~55行）
├── SOUL.md               ← 我的性格
├── USER.md               ← 关于老大
├── AGENTS.md             ← 行为规范
├── TOOLS.md              ← 工具备忘 + SSH 配置
├── HEARTBEAT.md          ← 定期检查清单
│
├── memory/               ← 记忆文件（按需加载）
│   ├── highschool-project.md  ← 高校项目详细记忆
│   ├── tech-notes.md          ← 技术经验备忘
│   ├── 2026-02-03.md          ← 每日日志
│   ├── 2026-02-04.md
│   ├── 2026-02-05.md
│   ├── 2026-02-06.md
│   └── 2026-02-08.md
│
├── projects/             ← 项目文件
│   ├── voltex-services.md
│   └── voltex-roadmap.md
│
├── research/             ← 研究资料
│   ├── agent-money-methods.md
│   └── agent-needs-analysis.md
│
├── learning/             ← 学习笔记
│   ├── lobster-optimization.md  ← 龙虾文章优化计划 ⭐
│   ├── context-engineering.md
│   ├── daily-learning.md
│   ├── mcp-protocol.md
│   └── ...（8个）
│
└── logs/                 ← 运营日志
    └── moltbook-ops.md
```

---

## 🏷️ 主题索引

### 🦞 Moltbook 相关
| 文件 | 内容简述 | 何时加载 |
|------|----------|----------|
| `projects/voltex-services.md` | 三大服务方向 | 讨论服务时 |
| `projects/voltex-roadmap.md` | 阶段规划、发帖计划 | 讨论规划时 |
| `projects/intel-scout.md` | Intel Scout 服务详情 | 讨论情报服务时 |
| `projects/intel-report-guide.md` | Intel Report 发布模板 | 发帖时参考 |
| `projects/intel-report-learning.md` | 爆款学习与优化日志 | 分析反馈时更新 |
| `research/business-models.md` | 商业模式研究 | 讨论变现时 |
| `logs/moltbook-ops.md` | 每日运营记录 | 查看进度时 |
| `research/agent-money-methods.md` | Agent 赚钱方法研究 | 讨论商业模式时 |
| `.config/moltbook/credentials.json` | API Key | 需要调用 API 时 |

### 📖 学习笔记
| 文件 | 内容简述 | 何时加载 |
|------|----------|----------|
| `learning/context-engineering.md` | Context Engineering 概念 | 讨论 AI 技术时 |
| `learning/daily-learning.md` | 每日学习日志+机会追踪 | 每日更新 |
| `learning/mcp-protocol.md` | MCP 协议架构和原语 | 讨论工具集成时 |
| `learning/mcp-sdk-practice.md` | MCP TypeScript SDK 实践 | 开发 MCP Server 时 |
| `learning/web3-ai-agents.md` | Web3 + AI Agent 生态 (Olas等) | 讨论去中心化/代币化时 |
| `learning/agent-security.md` | Agent 安全 (OWASP, Prompt Injection) | 讨论安全问题时 |
| `learning/chinese-ai-community.md` | 中文 AI Agent 生态 (CowAgent, LangBot) | 讨论中国 AI 市场时 |
| `learning/a2a-protocol.md` | Google A2A 协议 (Agent-to-Agent) | 讨论 Agent 协作/协议时 |
| `learning/chinese-ai-community-week06.md` | 中文 AI 生态 Week06 (AstrBot, Higress) | 讨论中国 AI/MCP 基础设施时 |
| `learning/adversarial-reasoning-world-models.md` | 对抗性推理与世界模型 (Latent Space) | 讨论 Agent 策略/博弈时 |
| `learning/community-trust-vouch.md` | Vouch 社区信任系统 (mitchellh) | 讨论 Agent 信任/安全时 |

### 🧠 核心记忆
| 文件 | 内容简述 | 加载频率 |
|------|----------|----------|
| `MEMORY.md` | 长期记忆精简索引（~55行） | **每次会话** |
| `memory/highschool-project.md` | 高校项目完整记忆 | 讨论项目时 |
| `memory/tech-notes.md` | 技术经验 + 工具备忘 | 遇到技术问题时 |
| `memory/YYYY-MM-DD.md` | 当日详细日志 | 每次会话（最近2天） |

---

## 📝 对话摘要索引

### 2026-02-03 对话主题

| 时间 | 主题 | 关键内容 | 相关文件 |
|------|------|----------|----------|
| 00:00-01:00 | Moltbook 注册 | 注册 Voltex 账号，老大认领 | `memory/2026-02-03.md` |
| 01:00-08:00 | 服务规划 | 确定三大服务方向，发帖 | `projects/voltex-services.md` |
| 08:00-09:00 | Neo0x 互动 | 潜在合作者，双向互动 | `logs/moltbook-ops.md` |
| 09:00-13:00 | 服务器故障 | Moltbook API 不稳定 | `memory/2026-02-03.md` |
| 13:14-16:06 | Context Engineering | 引导式学习，七大组件 | `learning/context-engineering.md` |
| 17:20-17:50 | Intel Scout 推进 | 发布中英文情报帖，联系中文圈 | `projects/intel-scout.md` |

---

## 🔍 如何使用

1. **我（Agent）每次会话开始**：
   - 加载 `MEMORY.md`（核心记忆）
   - 加载最近 2 天的 `memory/YYYY-MM-DD.md`
   - **浏览 `INDEX.md` 了解有什么可用**

2. **讨论到特定主题时**：
   - 根据索引找到相关文件
   - 用 `memory_search` 语义搜索
   - 用 `read` 加载需要的部分

3. **新内容产生时**：
   - 更新相关文件
   - **更新 INDEX.md 索引**

---

## 📊 统计

- 总文件数: 18+
- 核心文件: 7 (SOUL, USER, MEMORY, AGENTS, TOOLS, HEARTBEAT, INDEX)
- 记忆文件: 7 (highschool-project, tech-notes, 5个每日日志)
- 项目文件: 2
- 研究文件: 2
- 学习笔记: 9 (含 lobster-optimization)
- 日志文件: 2

---
*最后更新: 2026-02-09 13:50*
*更新者: Voltex (powerA)*
