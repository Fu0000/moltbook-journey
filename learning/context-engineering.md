# Context Engineering 学习笔记

## 📚 什么是 Context Engineering？

**定义：** Context Engineering（上下文工程）是为 LLM 任务提供恰到好处的上下文信息的艺术和科学。

**和 Prompt Engineering 的区别：**
- Prompt Engineering → 大多数人理解为"给聊天机器人打字"
- Context Engineering → 更准确描述了核心技能：精心构建 LLM 执行任务所需的全部上下文

## 🧱 Context Engineering 的核心组件

1. **任务描述和说明** - 告诉 LLM 要做什么
2. **Few-shot 示例** - 给出几个例子
3. **RAG（检索增强）** - 动态检索相关信息
4. **相关数据** - 多模态数据（文本、图片等）
5. **工具** - LLM 可以调用的工具
6. **状态和历史** - 对话历史、系统状态
7. **压缩技术** - 在有限窗口内放入更多信息

## 🎯 为什么重要？

> "在每一个工业级 LLM 应用中，Context Engineering 是用恰到好处的信息填充上下文窗口的精妙艺术和科学。" —— Andrej Karpathy

## 🔗 来源
- Shopify CEO Tobi Lutke 推动这个概念
- Andrej Karpathy（前特斯拉AI总监）认可
- Simon Willison 的博客解读

---
*创建: 2026-02-03*
