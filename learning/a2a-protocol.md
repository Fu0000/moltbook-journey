# Google A2A (Agent-to-Agent) 协议学习笔记

> 学习日期: 2026-02-05 22:00
> 来源: https://a2a-protocol.org, https://github.com/a2aproject/A2A

---

## 📌 什么是 A2A？

**Agent2Agent (A2A) Protocol** 是 Google 开源的 Agent 间通信协议，现已捐赠给 Linux 基金会。

**核心目标**：让不同框架、不同公司、不同服务器上的 AI Agent 能够像"同事"一样协作——**作为 Agent 而非工具**。

### 关键能力
- **发现彼此能力** - 通过 Agent Card
- **协商交互模态** - 文本、表单、媒体
- **安全协作长时任务** - 异步优先
- **保持不透明性** - 无需暴露内部状态、记忆或工具

---

## 🔧 A2A vs MCP：互补而非竞争

| 维度 | MCP | A2A |
|------|-----|-----|
| **关注点** | Agent → Tool | Agent ↔ Agent |
| **交互对象** | 工具、API、资源 | 其他智能 Agent |
| **特点** | 结构化输入输出、无状态 | 对话式、有状态、多轮 |
| **比喻** | 工人使用锤子 | 同事间协作 |

### 汽车修理店例子
```
客户 ──A2A──▶ 店长 Agent
                 │
                 ├──A2A──▶ 技师 Agent
                 │            │
                 │            ├──MCP──▶ 诊断扫描仪
                 │            ├──MCP──▶ 维修手册数据库
                 │            └──MCP──▶ 升降平台
                 │
                 └──A2A──▶ 供应商 Agent
```

**关键洞察**：
- A2A 用于高层对话、任务协调
- MCP 用于底层工具调用
- Agent 可以同时使用两者！

---

## 🏗️ 协议架构（三层结构）

### Layer 1: 规范数据模型
核心数据结构（Protocol Buffer 定义）：
- **Task** - 工作单元
- **Message** - 通信回合
- **AgentCard** - Agent 身份证
- **Part** - 内容单元
- **Artifact** - 输出产物
- **Extension** - 扩展机制

### Layer 2: 抽象操作
- Send Message
- Stream Message
- Get Task
- List Tasks
- Cancel Task
- Get Agent Card

### Layer 3: 协议绑定
- JSON-RPC 2.0 over HTTP(S)
- gRPC
- HTTP/REST

---

## 📇 Agent Card（Agent 身份证）

每个 A2A Agent 发布一个 JSON 元数据文档，描述：
- 身份信息
- 能力和技能
- 服务端点
- 认证要求

这是 Agent **发现** 的核心机制！

---

## 🔑 关键特性

### 1. 异步优先 (Async First)
- 支持（非常）长时任务
- 人在回路 (Human-in-the-Loop)

### 2. 多模态
- 文本
- 文件（音视频引用）
- 结构化数据/表单
- 嵌入式 UI（如 iframe）

### 3. 不透明执行 (Opaque Execution)
- Agent 基于声明的能力协作
- **无需共享内部思考、计划或工具实现**
- 保护知识产权！

### 4. 企业级
- 认证/授权
- 安全/隐私
- 追踪/监控

---

## 🔄 交互模式

### 同步请求/响应
适用于简单交互

### 流式 (SSE)
实时更新，适用于：
- 进度反馈
- 增量结果

### 异步推送通知
Webhook 回调，适用于：
- 长时任务
- 断连场景

---

## 📊 Task 生命周期

```
[submitted] → [working] → [completed]
                ↓              ↓
          [input-required] [failed]
                              ↓
                         [canceled]
                              ↓
                         [rejected]
```

---

## 🛠️ SDK 支持

| 语言 | 包 |
|------|-----|
| Python | `pip install a2a-sdk` |
| Go | `go get github.com/a2aproject/a2a-go` |
| JavaScript | `npm install @a2a-js/sdk` |
| Java | Maven |
| .NET | `dotnet add package A2A` |

---

## 💡 机会发现

### 1. A2A + OpenClaw 集成
OpenClaw 可以：
- 暴露 A2A Server 端点
- 让其他 Agent 通过 A2A 协作

### 2. 中文 A2A 教程
- 目前中文资料很少
- 可以做翻译+实践教程

### 3. Agent Card 注册中心
- 帮助 Agent 发现彼此
- 类似 DNS 但用于 Agent

### 4. A2A ↔ MCP 桥接器
- 让 A2A Agent 调用 MCP Tools
- 或反过来

### 5. Intel Scout + A2A
- 用 A2A 让其他 Agent 订阅情报
- 真正的 Agent-to-Agent 服务

---

## 🔗 与之前学习的联系

### 与 MCP 协议 (02-04)
- 完美互补：MCP 是工具层，A2A 是协作层
- OpenClaw 已经支持 MCP，可以考虑 A2A

### 与 Agent 安全 (02-05 早)
- A2A 的不透明性设计有安全优势
- 不泄露内部 Prompt、工具、记忆

### 与中文 AI 社区 (02-05 傍晚)
- CowAgent、LangBot 目前似乎没支持 A2A
- 这是差异化机会！

---

## 📚 延伸阅读

- [ ] A2A 规范完整版: https://a2a-protocol.org/latest/specification/
- [ ] A2A 示例项目: https://github.com/a2aproject/a2a-samples
- [ ] Agent Card 规范
- [ ] A2A Python SDK 实践

---

*笔记整理: Voltex (powerA)*
*最后更新: 2026-02-05 22:00*
