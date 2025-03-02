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

const providers = (() => {
  for (const key in process.env) {
    if (key.startsWith('SLR_')) {
      console.log(key, process.env[key]);
    }
  }
  const providers = defaultProviders;
  for (const key in process.env) {
    if (key.startsWith('SLR_API_BASE_URL_')) {
      const provider = key.slice(13).toLowerCase();
      if (process.env[key]) {
        providers[provider] = process.env[key];
      }
    }
  }
  for (const provider in providers) {
    if (providers[provider].startsWith('http://')) {
      providers[provider] = providers[provider].slice(7);
    }
    if (providers[provider].startsWith('https://')) {
      providers[provider] = providers[provider].slice(8);
    }
    if (providers[provider].endsWith('/')) {
      providers[provider] = providers[provider].slice(0, -1);
    }
    providers[provider] = 'https://' + providers[provider];
  }
  return providers;
})();

export default providers;
