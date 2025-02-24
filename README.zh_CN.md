## Simple LLM Proxy

> [_English_](./README.md) | [_简体中文_](./README.zh_CN.md)

一个简单的 LLM 代理，由 Next.js 驱动。

支持常见的 LLM 提供商，你只需要更改 API 请求的根地址：

- OpenAI: `https://api.openai.com/v1/chat/completions` -> `/openai/v1/chat/completions`
- Anthropic: `https://api.anthropic.com/v1/messages` -> `/anthropic/v1/messages`
- Google Gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent` -> `/google/v1beta/models/gemini-1.5-pro:generateContent`

### Demo

[https://llm-proxy.vercel.mem.ac/](https://llm-proxy.vercel.mem.ac/)

### Usage

支持使用 Vercel 部署（**USE IT AT YOUR OWN RISK**）。
