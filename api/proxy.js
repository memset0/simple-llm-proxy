export default async function handler(req, res) {
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

    if (response.body && response.body.getReader) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();

      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            break;
          }
          res.write(value);
        }
      };
      processStream();
    } else {
      // If not a stream, pipe the response directly
      response.body.pipe(res);
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
