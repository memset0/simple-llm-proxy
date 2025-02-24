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

// const getBaseUrl = (provider: Provider): string => {
//   const envVar = process.env[`API_BASE_URL_${provider.provider.toUpperCase()}`];
//   return envVar || `https://${provider.host}`;
// };

const providers = (() => {
  return defaultProviders;
})();

export default providers;
