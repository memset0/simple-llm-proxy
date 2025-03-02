/** @type {import('next').NextConfig} */
const config = {
  async rewrites() {
    return [
      {
        source: '/:_path*',
        // source: '/:path((?!_next/).*)',
        destination: '/api/proxy',
      },
    ];
  },
};

export default config;
