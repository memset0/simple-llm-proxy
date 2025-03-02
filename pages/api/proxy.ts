import { NextRequest } from 'next/server';
import envConfig from '@/lib/config';
import providers from '@/lib/providers';

export const config = {
  runtime: 'edge',
  api: {
    bodyParser: false, // 禁用内置的 body 解析
    responseLimit: false, // 取消响应大小限制
  },
  // https://vercel.com/docs/concepts/edge-network/regions
  regions: ['cle1', 'iad1', 'pdx1', 'sfo1', 'sin1', 'syd1', 'hnd1', 'kix1'],
  ...envConfig,
};

const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': '*',
  'access-control-allow-headers': '*',
};

const filterHeaders = (headers: Headers, ignoreKeys: (string | RegExp)[]): Headers => {
  const picked = new Headers();
  for (const key of headers.keys()) {
    if (!ignoreKeys.some((k) => (typeof k === 'string' ? k === key : k.test(key)))) {
      const value = headers.get(key);
      if (typeof value === 'string') {
        picked.set(key, value);
      }
    }
  }
  return picked;
};

export function getApiKey(headers: Headers, provider: string = 'all'): string | null {
  if (provider === 'all' || provider === 'openai') {
    const apiKey = headers.get('Authorization');
    if (apiKey) {
      if (apiKey.split(' ').length === 2 && apiKey.split(' ')[0].toLowerCase() === 'bearer') {
        return apiKey.split(' ')[1];
      }
    }
  }
  if (provider === 'all' || provider === 'anthropic') {
    const apiKey = headers.get('x-api-key');
    if (apiKey) {
      return apiKey;
    }
  }
  if (provider === 'all' || provider === 'google') {
    const apiKey = headers.get('x-goog-api-key');
    if (apiKey) {
      return apiKey;
    }
  }
  return null;
}

export function setApiKey(apiKey: string, headers: Headers, provider: string = 'all'): void {
  if (provider === 'all' || provider === 'openai') {
    headers.set('Authorization', `Bearer ${apiKey}`);
  }
  if (provider === 'all' || provider === 'anthropic') {
    headers.set('x-api-key', apiKey);
  }
  if (provider === 'all' || provider === 'google') {
    headers.set('x-goog-api-key', apiKey);
  }
}

export default async function (request: NextRequest & { nextUrl?: URL }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }

  const { pathname, searchParams } = request.nextUrl ? request.nextUrl : new URL(request.url);
  const headers = filterHeaders(request.headers, [
    /^x\-vercel\-.+$/, // vercel 相关头
    /^x\-forwarded\-.+$/, // 转发相关头
    /^sec\-.+$/, // 安全相关头
    'content-length',
    'dnt',
    'referer',
    'upgrade-insecure-requests',
  ]);

  if (pathname.startsWith('/debug/')) {
    // just for debuugging...
    return new Response(
      JSON.stringify({
        headers: Object.fromEntries(headers.entries()), //
        searchParams: Object.fromEntries(searchParams.entries()),
      }),
      {
        headers: CORS_HEADERS,
        status: 200,
      }
    );
  }

  let url: URL | null = null;
  for (const provider in providers) {
    if (pathname.startsWith(`/${provider}/`)) {
      console.log(providers[provider] + pathname.slice(provider.length + 1));
      url = new URL(providers[provider] + pathname.slice(provider.length + 1));
      searchParams.delete('_path');
      break;
    }
  }
  if (url === null) {
    return new Response('Not Found', { status: 404 });
  }

  if (config.polling) {
    for (const provider of ['openai', 'anthropic', 'google']) {
      const apiKey = getApiKey(headers, provider);
      if (apiKey !== null && apiKey.includes(',')) {
        const apiKeys = apiKey.split(',');
        setApiKey(apiKeys[Math.floor(Math.random() * apiKeys.length)], headers, provider);
      }
    }
  }
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url, {
    body: request.body,
    method: request.method,
    headers,
  });

  const responseHeaders = {
    ...CORS_HEADERS,
    ...Object.fromEntries(response.headers),
  };

  return new Response(response.body, {
    headers: responseHeaders,
    status: response.status,
  });
}
