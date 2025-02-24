export default async function handler(req, res) {
  try {
    let targetUrl;
    let pathname;

    if (req.url.startsWith('/openai/')) {
      pathname = req.url.replace('/openai/', '');
      targetUrl = `https://api.openai.com/${pathname}`;
    } 
    else if (req.url.startsWith('/google/')) {
      pathname = req.url.replace('/google/', '');
      targetUrl = `https://generativelanguage.googleapis.com/${pathname}`;
    }
    else {
      return res.status(404).json({ error: 'Invalid API endpoint' });
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}