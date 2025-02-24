export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    let targetUrl;
    let pathname;

    if (req.url.startsWith('/openai/')) {
      pathname = req.url.replace('/openai/', '');
      targetUrl = `https://api.openai.com/${pathname}`;
    } else if (req.url.startsWith('/google/')) {
      pathname = req.url.replace('/google/', '');
      targetUrl = `https://generativelanguage.googleapis.com/${pathname}`;
    } else {
      return res.status(404).json({ error: 'Invalid API endpoint' });
    }

    // Create a new Headers object and copy headers, excluding 'content-length'
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (key.toLowerCase() !== 'content-length') {
        headers.append(key, value);
      }
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers, // Use the modified headers
      body: req.method !== 'GET' ? req.body : undefined, // Pass the raw request body directly
    });

    // 复制相应的所有请求头
    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }

    const contentType = response.headers.get('content-type') || '';
    if (
      contentType.includes('stream') || //
      response.headers.get('transfer-encoding') === 'chunked' || //
      contentType.includes('event-stream')
    ) {
      // 流式请求
      const reader = response.body.getReader();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
          } catch (error) {
            controller.error(error);
          } finally {
            controller.close();
            reader.releaseLock();
          }
        },
      });

      await stream.pipeTo(res);
    } else {
      // 非流式请求
      const data = await response.text();
      res.send(data);
    }
  } catch (error) {
    console.error('Fetch Error:', error); // 将错误记录到控制台

    let errorDetails = {
      message: 'fetch failed',
      error: error.message,
    };

    if (error.cause) {
      errorDetails.cause = error.cause;
    }
    if (error.stack) {
      errorDetails.stack = error.stack;
    }
    res.status(500).json(errorDetails);
  }
}

export const config = {
  api: {
    bodyParser: false, // 禁用内置的 body 解析
    responseLimit: false, // 取消响应大小限制
  },
};
