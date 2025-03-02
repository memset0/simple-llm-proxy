import { NextRequest } from 'next/server';
import { getDisplayedProviders } from '@/lib/providers';

export const config = {
  runtime: 'edge',
};

export default async function (request: NextRequest) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const providers = getDisplayedProviders();

  return new Response(JSON.stringify({ providers }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
