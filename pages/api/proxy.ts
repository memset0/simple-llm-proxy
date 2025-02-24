import { NextRequest } from 'next/server';
import providers from '@/lib/providers';

export const config = {
  runtime: 'edge',
  api: {
    bodyParser: false, // 禁用内置的 body 解析
    responseLimit: false, // 取消响应大小限制
  },
  // https://vercel.com/docs/concepts/edge-network/regions
  regions: ['cle1', 'iad1', 'pdx1', 'sfo1', 'sin1', 'syd1', 'hnd1', 'kix1'],
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
      url = new URL(pathname.slice(provider.length + 1), providers[provider]);
      searchParams.delete('_path');
      break;
    }
  }
  if (url === null) {
    return new Response('Not Found', { status: 404 });
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
