# Simple LLM Router

> [_English_](./README.md) | [_简体中文_](./README.zh_CN.md)

A simple LLM router powered by Next.js.

Supports common LLM providers by simply changing the API request root URL:

- OpenAI: `https://api.openai.com/v1/chat/completions` -> `/openai/v1/chat/completions`
- Anthropic: `https://api.anthropic.com/v1/messages` -> `/anthropic/v1/messages`
- Google Gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent` -> `/google/v1beta/models/gemini-1.5-pro:generateContent`

### Demo

[https://llm-proxy.vercel.mem.ac/](https://llm-proxy.vercel.mem.ac/)

### Usage

Supports deployment on Vercel (**USE IT AT YOUR OWN RISK**).

### Environment Variables

#### `SLR_API_BASE_URL_xxx`

Set and provide your own API base URL, where `xxx` is the provider name. The value of the environment variable is the provider's API base URL. Multiple providers can be configured.

#### `SLR_HIDE_PROVIDERS`

Set a list of providers to hide on the login page. Multiple providers should be separated by `,`. Disabled by default.

#### `SLR_POLLING`

Whether to enable polling. Set to `true` to enable, disabled by default.

Only effective for OpenAPI, Google, and Anthropic. Multiple API keys should be separated by `,`.

