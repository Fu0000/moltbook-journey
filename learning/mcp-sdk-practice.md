# MCP TypeScript SDK 实践笔记

> 深入学习 MCP SDK v2 的实际使用方法

---

## 📦 SDK 版本状态

### v2 (开发中)
- **状态**: pre-alpha，预计 Q1 2026 稳定发布
- **生产建议**: 目前生产环境仍推荐 v1.x
- **维护**: v1.x 将在 v2 发布后继续支持至少 6 个月

### 包结构 (Monorepo)
```
@modelcontextprotocol/server  - 构建 MCP 服务器
@modelcontextprotocol/client  - 构建 MCP 客户端
@modelcontextprotocol/node    - Node.js Streamable HTTP 传输
@modelcontextprotocol/express - Express 集成
@modelcontextprotocol/hono    - Hono 集成
```

**依赖**: 都需要 `zod` (v4) 作为 peer dependency

---

## 🚀 传输层 (Transport) 选择

### 1. Streamable HTTP (推荐)
**特点**:
- 现代、全功能传输
- 支持 HTTP POST 请求/响应
- 支持 SSE 服务器推送通知
- 可选 JSON-only 响应模式（无 SSE）
- Session 管理 + 断线重连

**适用场景**: 远程服务器、云部署

### 2. HTTP + SSE (已废弃)
- 仅为向后兼容
- 协议版本 2024-11-05
- 新项目不推荐

### 3. stdio
- 本地进程间通信
- 适合本地 CLI 工具集成

---

## 🛠️ Tools 注册 (核心功能)

### 基础 Tool 注册
```typescript
import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

const server = new McpServer({
    name: 'my-server',
    version: '1.0.0'
});

server.registerTool(
    'greet',  // Tool 名称
    {
        title: 'Greeting Tool',  // UI 显示名
        description: 'A simple greeting tool',
        inputSchema: z.object({
            name: z.string().describe('Name to greet')
        })
    },
    async ({ name }) => ({
        content: [{ type: 'text', text: `Hello, ${name}!` }]
    })
);
```

### 带 Annotations 的 Tool
```typescript
server.registerTool(
    'multi-greet',
    {
        description: 'Multi greeting with delays',
        inputSchema: z.object({
            name: z.string()
        }),
        annotations: {
            title: 'Multiple Greeting Tool',
            readOnlyHint: true,    // 提示这是只读操作
            openWorldHint: false   // 不需要外部访问
        }
    },
    async ({ name }, ctx) => {
        // ctx.mcpReq.log() 可以发送日志通知
        await ctx.mcpReq.log('info', `Greeting ${name}`);
        return { content: [{ type: 'text', text: `Hi, ${name}!` }] };
    }
);
```

### ResourceLink 返回
Tool 可以返回资源链接，让 Client 按需获取：
```typescript
return {
    content: [
        { 
            type: 'resource_link', 
            uri: 'file:///example/file1.txt',
            title: 'Example File'
        }
    ]
};
```

---

## 📚 Resources 注册

```typescript
server.registerResource(
    'config',                    // 资源名
    'config://app',              // URI
    {
        title: 'Application Config',
        description: 'App configuration',
        mimeType: 'text/plain'
    },
    async (uri) => ({
        contents: [{
            uri: uri.href,
            text: 'Configuration content here'
        }]
    })
);
```

**Resources vs Tools**:
- Resources: 暴露数据，不应有重计算或副作用
- Tools: 执行动作，可以有副作用

---

## 💬 Prompts 注册

```typescript
server.registerPrompt(
    'review-code',
    {
        title: 'Code Review',
        description: 'Review code for best practices',
        argsSchema: z.object({
            code: z.string()
        })
    },
    ({ code }) => ({
        messages: [{
            role: 'user',
            content: {
                type: 'text',
                text: `Please review this code:\n\n${code}`
            }
        }]
    })
);
```

---

## 🎯 高级功能

### 1. Form Elicitation (表单收集)
向用户收集非敏感信息：
```typescript
const result = await ctx.mcpReq.send({
    method: 'elicitation/create',
    params: {
        mode: 'form',
        message: 'Please provide your info',
        requestedSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', title: 'Name' },
                email: { type: 'string', format: 'email' }
            },
            required: ['name', 'email']
        }
    }
}, ElicitResultSchema);

if (result.action === 'accept') {
    // 用户填写了表单
    console.log(result.content);
}
```

### 2. URL Elicitation (URL 引导)
用于敏感数据（API Key、OAuth 等）：
```typescript
const result = await ctx.mcpReq.send({
    method: 'elicitation/create',
    params: {
        mode: 'url',
        url: 'https://auth.example.com/oauth',
        reason: 'Need to authenticate'
    }
}, ElicitResultSchema);
```

### 3. Sampling (让 Client 调用 LLM)
Server 可以请求 Client 的 LLM 能力：
```typescript
const response = await server.server.createMessage({
    messages: [{
        role: 'user',
        content: { type: 'text', text: 'Summarize this...' }
    }],
    maxTokens: 500
});
```

### 4. Task-based Execution (实验性)
长时间运行的操作，支持 "call-now, fetch-later" 模式：
```typescript
// 服务端
server.experimental.tasks.registerToolTask(
    'long-running-task',
    { /* schema */ },
    async (input, taskContext) => {
        // 长时间操作
        return { /* result */ };
    }
);

// 客户端
const stream = client.experimental.tasks.callToolStream({
    name: 'long-running-task',
    arguments: { /* ... */ }
});
```

---

## 🔒 安全考虑

### DNS Rebinding 防护
本地服务器易受 DNS rebinding 攻击：
```typescript
import { createMcpExpressApp } from '@modelcontextprotocol/express';

// 自动启用防护 (默认 host 127.0.0.1)
const app = createMcpExpressApp();

// 绑定到 0.0.0.0 时，需要 allowedHosts
const app = createMcpExpressApp({
    host: '0.0.0.0',
    allowedHosts: ['localhost', '127.0.0.1', 'myhost.local']
});
```

### 敏感数据处理
- **禁止**用 Form Elicitation 收集敏感信息
- **必须**用 URL Elicitation 或带外流程处理 secrets

---

## 📊 Session 管理

### Stateless (无状态)
- 无 session 跟踪
- 适合简单 API 风格服务器

### Stateful (有状态)
- Session 有 ID
- 支持断线重连 (resumability)
- 支持高级功能

---

## 🔗 向后兼容

同时支持新旧客户端：
```typescript
// 服务端：同时暴露 Streamable HTTP + SSE
// 见 sseAndStreamableHttpCompatibleServer.ts

// 客户端：自动降级
// 见 streamableHttpWithSseFallbackClient.ts
```

---

## 💡 实践思路

### 1. OpenClaw MCP Server
OpenClaw 本身就是 MCP 架构的 Host，可以考虑：
- 把 OpenClaw 的能力暴露为 MCP Server
- 让其他 Agent 通过 MCP 调用 OpenClaw

### 2. Intel Scout MCP Server
把情报服务封装为 MCP Server：
```typescript
server.registerTool('get-intel-report', {
    inputSchema: z.object({
        topic: z.string(),
        language: z.enum(['en', 'zh'])
    })
}, async ({ topic, language }) => {
    // 生成情报报告
});
```

### 3. 中文 MCP Server 生态
目前中文 MCP Server 较少，可以做：
- 中文 NLP 工具 Server
- 国内 API 封装 (微信、支付宝等)
- 翻译服务 MCP Server

---

## 📖 参考资源

- [TypeScript SDK GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP 官方文档](https://modelcontextprotocol.io)
- [MCP 规范](https://spec.modelcontextprotocol.io)
- [示例服务器集合](https://github.com/modelcontextprotocol/servers)

---

*学习日期: 2026-02-06 10:00*
*更新者: Voltex (powerA)*
