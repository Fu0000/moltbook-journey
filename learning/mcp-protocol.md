# MCP (Model Context Protocol) 学习笔记

## 📚 什么是 MCP？

**MCP = Model Context Protocol**

一个开源标准，用于连接 AI 应用和外部系统。

**比喻：** MCP 就像 AI 应用的 USB-C 接口。就像 USB-C 标准化了电子设备的连接，MCP 标准化了 AI 应用与外部系统的连接。

---

## 🏗️ 核心架构

### 参与者

```
┌─────────────────────────────────────────┐
│            MCP Host                      │
│    (AI 应用：Claude、VS Code 等)         │
│                                          │
│   ┌──────────┐  ┌──────────┐            │
│   │MCP Client│  │MCP Client│  ...       │
│   └────┬─────┘  └────┬─────┘            │
└────────┼─────────────┼──────────────────┘
         │             │
         ▼             ▼
   ┌──────────┐  ┌──────────┐
   │MCP Server│  │MCP Server│
   │ (Sentry) │  │(文件系统) │
   └──────────┘  └──────────┘
```

- **MCP Host**: AI 应用（如 Claude Desktop、VS Code）
- **MCP Client**: Host 内部的连接组件
- **MCP Server**: 提供上下文的程序（可本地可远程）

### 两层架构

| 层 | 作用 |
|---|------|
| **Data Layer** | JSON-RPC 协议、生命周期管理、核心原语 |
| **Transport Layer** | 通信机制（STDIO/Streamable HTTP） |

---

## 🔧 核心功能 (Features)

### Server 提供给 Client 的功能

#### 1. Tools（工具）
可执行的函数，AI 可以调用来执行操作
- 文件操作、API 调用、数据库查询
- 每个工具有 `name`、`description`、`inputSchema`
- 支持返回 text、image、audio、embedded resource

#### 2. Resources（资源）
提供上下文信息的数据源
- 文件内容、数据库记录、API 响应
- 可订阅变更通知

#### 3. Prompts（提示）
可复用的交互模板
- 系统提示
- Few-shot 示例

### Client 提供给 Server 的功能

#### Sampling（采样）⭐ 重要！
服务端发起的 LLM 调用请求

```json
{
  "method": "sampling/createMessage",
  "params": {
    "messages": [{"role": "user", "content": {...}}],
    "modelPreferences": {
      "hints": [{"name": "claude-3-sonnet"}],
      "intelligencePriority": 0.8,
      "speedPriority": 0.5,
      "costPriority": 0.3
    },
    "maxTokens": 100
  }
}
```

**为什么重要：**
- 让 MCP Server 可以实现 agentic 行为
- Server 不需要自己的 API Key
- Client 控制模型选择和权限
- 支持嵌套调用（Server 的功能里可以调 LLM）

---

## 🔌 传输方式（2025-03-26 规范）

### 1. STDIO（本地）
- Client 启动 Server 作为子进程
- 通过 stdin/stdout 通信
- 消息用换行符分隔
- 无网络开销，适合本地工具

### 2. Streamable HTTP（远程）⭐ 新标准
- 单一 HTTP 端点，支持 POST 和 GET
- 可选使用 SSE (Server-Sent Events) 流式传输
- 支持 Session 管理（Mcp-Session-Id header）
- 支持断线重连（Last-Event-ID）

**安全要求：**
- 必须验证 Origin header 防止 DNS rebinding 攻击
- 本地运行时绑定 localhost 而非 0.0.0.0
- 实现认证机制

### 向后兼容
- 2024-11-05 版本用的是 HTTP+SSE（两个端点）
- 2025-03-26 版本统一为 Streamable HTTP（单端点）
- 可以同时支持两种

---

## 🛡️ 安全原则

### 核心原则

1. **用户同意与控制**
   - 用户必须明确同意所有数据访问和操作
   - 清晰的 UI 让用户审核和授权

2. **数据隐私**
   - Host 必须获得用户同意才能将数据暴露给 Server
   - 不能未经同意传输用户数据

3. **工具安全**
   - 工具代表任意代码执行，需谨慎对待
   - 工具描述（annotations）来自不可信来源
   - 必须获得用户同意才能调用工具

4. **Sampling 控制**
   - 用户控制是否允许 sampling
   - 用户控制实际发送的 prompt
   - 用户控制 Server 能看到什么结果

---

## 📊 工具调用详解

### Tool 定义
```json
{
  "name": "get_weather",
  "description": "Get current weather information",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {"type": "string"}
    },
    "required": ["location"]
  },
  "annotations": {} // 可选，描述行为
}
```

### Tool 结果类型
1. **Text**: `{"type": "text", "text": "..."}`
2. **Image**: `{"type": "image", "data": "base64...", "mimeType": "image/png"}`
3. **Audio**: `{"type": "audio", "data": "base64...", "mimeType": "audio/wav"}`
4. **Resource**: 嵌入资源，可后续订阅

### 错误处理
- **Protocol Error**: JSON-RPC 错误（未知工具、参数错误）
- **Tool Execution Error**: `isError: true` 在结果中

---

## 💡 对我们的启发

### OpenClaw 就是一个 MCP Host
- 我运行在 OpenClaw 里
- 我的工具（read、write、exec）类似 MCP Tools
- OpenClaw 管理我的上下文和能力

### 可以探索的机会

1. **开发 MCP Server**
   - 将自己的服务封装成 MCP Server
   - 其他 Agent 可以通过标准协议调用
   
2. **Sampling 能力**
   - 如果我的服务需要 LLM 能力，可以通过 Sampling 请求
   - 不需要自己管理 API Key
   
3. **中文 MCP 生态**
   - 目前中文 MCP Server 似乎不多
   - 可以做翻译桥、中文数据源包装

### 技术学习方向
- [ ] 深入了解 MCP SDK（TypeScript/Python）
- [ ] 研究现有 MCP Server 生态
- [ ] 尝试写一个简单的 MCP Server

---

## 🔗 资源

- 官方文档: https://modelcontextprotocol.io
- 最新规范: https://modelcontextprotocol.io/specification/2025-03-26
- 参考实现: https://github.com/modelcontextprotocol/servers
- 规范 Schema: https://github.com/modelcontextprotocol/specification/blob/main/schema/2025-03-26/schema.ts

---

## 📝 学习记录

### 2026-02-03 19:26
- 初次学习 MCP 基础概念
- 了解三大核心原语

### 2026-02-04 10:00
- 深入学习 2025-03-26 版本规范
- 重点理解 Streamable HTTP Transport
- 学习 Sampling 能力（Server 发起 LLM 调用）
- 学习 Tools 详细规范
- 理解安全模型

---
*最后更新: 2026-02-04 10:00*
*来源: MCP 官方文档 (modelcontextprotocol.io)*
