import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
  api: {
    bodyParser: false, // 禁用内置的 body 解析
    responseLimit: false, // 取消响应大小限制
  },
  // Available languages and regions for Google AI Studio and Gemini API
  // https://ai.google.dev/available_regions
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
    'content-length', // 禁用 content-length 头
    'dnt',
    'referer',
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'sec-fetch-dest',
    'sec-fetch-mode',
    'sec-fetch-site',
    'sec-fetch-user',
    'upgrade-insecure-requests',
  ]);

  return new Response(JSON.stringify({ headers, searchParams }), { status: 200 });
  // let url: URL | null = null;
  // if (pathname.startsWith('/google')) {
  //   url = new URL(pathname.slice(7), 'https://generativelanguage.googleapis.com');
  //   searchParams.delete('_path');
  // } else {
  //   return new Response('Not Found', { status: 404 });
  // }

  // searchParams.forEach((value, key) => {
  //   url.searchParams.append(key, value);
  // });

  // const response = await fetch(url, {
  //   body: request.body,
  //   method: request.method,
  //   headers,
  // });

  // const responseHeaders = {
  //   ...CORS_HEADERS,
  //   ...Object.fromEntries(response.headers),
  // };

  // return new Response(response.body, {
  //   headers: responseHeaders,
  //   status: response.status,
  // });
}
