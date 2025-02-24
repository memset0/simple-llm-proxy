## Simple LLM Router

> [_English_](./README.md) | [_简体中文_](./README.zh_CN.md)

A simple LLM proxy powered by Next.js.

Supports common LLM providers by simply changing the API request root URL:

- OpenAI: `https://api.openai.com/v1/chat/completions` -> `/openai/v1/chat/completions`
- Anthropic: `https://api.anthropic.com/v1/messages` -> `/anthropic/v1/messages`
- Google Gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent` -> `/google/v1beta/models/gemini-1.5-pro:generateContent`

### Demo

[https://llm-proxy.vercel.mem.ac/](https://llm-proxy.vercel.mem.ac/)

### Usage

Supports deployment on Vercel (**USE IT AT YOUR OWN RISK**).
