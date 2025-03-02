export const defaultProviders: { [Key: string]: string } = {
  openai: 'api.openai.com',
  anthropic: 'api.anthropic.com',
  google: 'generativelanguage.googleapis.com',
  deepseek: 'api.deepseek.com',
  qwen: 'dashscope.aliyuncs.com/compatible-mode',
  grok: 'api.x.ai',
  nvidia: 'integrate.api.nvidia.com',
  siliconflow: 'api.siliconflow.cn',
  openrouter: 'openrouter.ai/api',
};

// 缓存 providers 结果以避免重复计算
let cachedProviders: { [Key: string]: string } | null = null;

export function getProviders() {
  // 如果已经计算过，直接返回缓存结果
  if (cachedProviders) {
    return cachedProviders;
  }

  // 打印环境变量 (server side)
  if (typeof process !== 'undefined' && process.env) {
    for (const key in process.env) {
      if (key.startsWith('SLR_')) {
        console.log(key, process.env[key]);
      }
    }
  }

  // 复制默认 providers 以避免修改原始对象
  const providers = { ...defaultProviders };

  // 从环境变量添加自定义 providers (server side)
  if (typeof process !== 'undefined' && process.env) {
    for (const key in process.env) {
      if (key.startsWith('SLR_API_BASE_URL_')) {
        const provider = key.slice(17).toLowerCase();
        if (process.env[key]) {
          providers[provider] = process.env[key];
        }
      }
    }
  }

  // 处理 URL 格式
  for (const provider in providers) {
    let url = providers[provider];
    if (url.startsWith('http://')) {
      url = url.slice(7);
    }
    if (url.startsWith('https://')) {
      url = url.slice(8);
    }
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    providers[provider] = 'https://' + url;
  }

  console.log('providers:', providers);

  // 缓存结果
  cachedProviders = providers;
  return providers;
}

let cachedDisplayedProviders: { [Key: string]: string } | null = null;

export function getDisplayedProviders() {
  if (cachedDisplayedProviders) {
    return cachedDisplayedProviders;
  }

  const providers = getProviders();
  const hideProviders = typeof process !== 'undefined' && process.env.SLR_HIDE_PROVIDERS ? process.env.SLR_HIDE_PROVIDERS.split(',') : [];

  const displayedProviders: { [Key: string]: string } = {};
  for (const provider in providers) {
    if (!hideProviders.includes(provider)) {
      displayedProviders[provider] = providers[provider];
    }
  }
  console.log('displayedProviders:', displayedProviders);

  cachedDisplayedProviders = displayedProviders;
  return displayedProviders;
}

const providers = getProviders();
