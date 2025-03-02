const config = (() => {
  const config = {
    polling: process.env.SLR_POLLING?.toLowerCase() === 'true',
    compatibilityMode: process.env.SLR_COMPATIBILITY_MODE?.toLowerCase() === 'true',
  };
  return config;
})();

export default config;
