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
  const providers = defaultProviders;
  for (const key in process.env) {
    if (key.startsWith('API_BASE_URL_')) {
      const provider = key.slice(13).toLowerCase();
      if (process.env[key]) {
        providers[provider] = process.env[key];
      }
    }
  }
  return providers;
})();

export default providers;
