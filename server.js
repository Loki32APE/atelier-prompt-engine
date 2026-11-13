/**
 * ATELIER PROMPT ENGINE — BACKEND SERVER (ZERO DEPENDENCY)
 * Secure OpenRouter API Proxy with Server-Side Environment Variables
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. API: Status Check
  if (pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      hasServerKey: !!OPENROUTER_API_KEY,
      envKeyConfigured: !!process.env.OPENROUTER_API_KEY
    }));
    return;
  }

  // 2. API: Vision Extraction Proxy (Uses server-side OPENROUTER_API_KEY)
  if (pathname === '/api/vision' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard against oversized payloads (> 20MB)
      if (body.length > 20 * 1024 * 1024) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const apiKey = OPENROUTER_API_KEY || req.headers['authorization']?.replace('Bearer ', '');

        if (!apiKey) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'OPENROUTER_API_KEY environment variable is not configured on Render. Please add it in Render Dashboard -> Environment Variables.'
          }));
          return;
        }

        const model = payload.model || 'nvidia/llama-3.1-nemotron-70b-instruct';
        const type = payload.type || 'look';
        const imageBase64 = payload.image;

        if (!imageBase64) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing image payload' }));
          return;
        }

        const systemPrompt = type === 'look'
          ? 'Analyze this LOOK image. Extract: FRAMING, POSE AND ACTION (use screen-left and screen-right), AND GAZE, LIGHTING AND CAMERA, BACKGROUND AND ENVIRONMENT, MAKEUP. Keep it short and factual.'
          : 'Analyze this OUTFIT image. Extract: GARMENTS, FABRIC WEAVE & WEIGHT, SILHOUETTE, DRAPING, JEWELLERY AND ACCESSORIES. Keep it concise.';

        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': req.headers.referer || 'https://render.com',
            'X-Title': 'Atelier Prompt Engine'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: [
                { type: 'text', text: 'Extract features from this fashion reference photo:' },
                { type: 'image_url', image_url: { url: imageBase64 } }
              ]}
            ],
            max_tokens: 800
          })
        });

        if (!openRouterResponse.ok) {
          const errData = await openRouterResponse.json().catch(() => ({}));
          res.writeHead(openRouterResponse.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: errData.error?.message || `OpenRouter returned status ${openRouterResponse.status}`
          }));
          return;
        }

        const data = await openRouterResponse.json();
        const content = data.choices?.[0]?.message?.content || '';

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          model: model,
          content: content
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Internal server proxy error' }));
      }
    });
    return;
  }

  // 3. Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // Normalize path to prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Error loading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`[Atelier Prompt Engine] Server running on port ${PORT}`);
  console.log(`[Atelier Prompt Engine] Server OPENROUTER_API_KEY configured: ${!!OPENROUTER_API_KEY}`);
});
