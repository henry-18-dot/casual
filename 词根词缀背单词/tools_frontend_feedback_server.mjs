import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.TOOL_PORT || 8787);
const HOST = process.env.TOOL_HOST || '0.0.0.0';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://127.0.0.1:5173';
const ARTIFACT_DIR = path.join(__dirname, 'artifacts');
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'screenshots');
const FEEDBACK_FILE = path.join(ARTIFACT_DIR, 'feedback.json');

await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

const readFeedback = async () => {
  try {
    const raw = await fs.readFile(FEEDBACK_FILE, 'utf-8');
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const writeFeedback = async (items) => {
  await fs.mkdir(ARTIFACT_DIR, { recursive: true });
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(items, null, 2), 'utf-8');
};

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) reject(new Error('Body too large'));
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });

const sendJson = (res, code, payload) => {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};

const sendHtml = (res, html) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(html);
};

const buildMeta = ({ route = '/', project = 'shared', ext = 'png' }) => {
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  const targetUrl = new URL(normalizedRoute, FRONTEND_URL).toString();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${project}-${stamp}.${ext}`;
  const filePath = path.join(SCREENSHOT_DIR, fileName);
  return { targetUrl, fileName, filePath };
};

const captureWithPlaywright = async (targetUrl, filePath, width, height, fullPage) => {
  const mod = await import('playwright');
  const browser = await mod.chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } });
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 45_000 });
    await page.screenshot({ path: filePath, fullPage: Boolean(fullPage) });
    return 'playwright';
  } finally {
    await browser.close();
  }
};

const captureWithThum = async (targetUrl, filePath, width) => {
  const thumUrl = `https://image.thum.io/get/width/${Number(width) || 1440}/noanimate/${encodeURIComponent(targetUrl)}`;
  const resp = await fetch(thumUrl);
  if (!resp.ok) throw new Error(`thum failed: ${resp.status}`);
  const buffer = Buffer.from(await resp.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return 'thum.io';
};


const capturePlaceholder = async (targetUrl, filePath) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='760'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#0b1220'/><stop offset='100%' stop-color='#1d4ed8'/></linearGradient></defs><rect width='1200' height='760' fill='url(#g)'/><text x='60' y='110' fill='#e2e8f0' font-size='46' font-family='Arial'>Screenshot fallback</text><text x='60' y='180' fill='#cbd5e1' font-size='28' font-family='Arial'>target: ${targetUrl}</text><text x='60' y='230' fill='#cbd5e1' font-size='24' font-family='Arial'>time: ${new Date().toISOString()}</text></svg>`;
  await fs.writeFile(filePath, svg, 'utf-8');
  return 'placeholder-svg';
};

const screenshot = async ({ route = '/', project = 'shared', width = 1440, height = 900, fullPage = true }) => {
  let ext = 'png';
  let { filePath, fileName, targetUrl } = buildMeta({ route, project, ext });
  let driver = 'playwright';
  try {
    driver = await captureWithPlaywright(targetUrl, filePath, width, height, fullPage);
  } catch {
    try {
      driver = await captureWithThum(targetUrl, filePath, width);
    } catch {
      ext = 'svg';
      ({ filePath, fileName, targetUrl } = buildMeta({ route, project, ext }));
      driver = await capturePlaceholder(targetUrl, filePath);
    }
  }
  return {
    ok: true,
    filePath,
    imageUrl: `/artifacts/screenshots/${fileName}`,
    targetUrl,
    driver,
  };
};

const server = http.createServer(async (req, res) => {
  if (!req.url) return sendJson(res, 400, { ok: false, message: 'Missing URL' });
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/health') return sendJson(res, 200, { ok: true, service: 'frontend-feedback-tool' });

  if (req.method === 'POST' && url.pathname === '/api/screenshot') {
    try {
      const body = await parseBody(req);
      const result = await screenshot(body);
      return sendJson(res, 200, result);
    } catch (error) {
      return sendJson(res, 500, { ok: false, message: error.message || 'screenshot failed' });
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/feedback') {
    const project = url.searchParams.get('project');
    const items = await readFeedback();
    const filtered = project ? items.filter((it) => it.project === project) : items;
    return sendJson(res, 200, { ok: true, items: filtered.slice().reverse() });
  }

  if (req.method === 'POST' && url.pathname === '/api/feedback') {
    try {
      const body = await parseBody(req);
      const items = await readFeedback();
      const item = {
        id: randomUUID(),
        project: body.project || 'shared',
        author: body.author || 'anonymous',
        message: body.message || '',
        rating: Number(body.rating || 5),
        createdAt: new Date().toISOString(),
      };
      items.push(item);
      await writeFeedback(items);
      return sendJson(res, 201, { ok: true, item });
    } catch (error) {
      return sendJson(res, 400, { ok: false, message: error.message || 'feedback failed' });
    }
  }

  if (req.method === 'GET' && url.pathname === '/mobile-feedback') {
    const project = url.searchParams.get('project') || 'shared';
    const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Mobile Feedback</title>
<style>body{font-family:system-ui;padding:16px;background:#0b1220;color:#e2e8f0}input,textarea,button{width:100%;margin:8px 0;padding:10px;border-radius:10px;border:1px solid #475569;background:#182132;color:#e2e8f0}button{background:#334155}small{color:#94a3b8}</style></head><body>
<h3>项目 ${project} 手机反馈</h3><small>提交后会被前端工具页读取。</small>
<form id="f"><input name="author" placeholder="昵称" value="mobile-user"/><textarea name="message" placeholder="反馈内容"></textarea><input name="rating" type="number" min="1" max="5" value="5"/><button type="submit">提交</button></form>
<p id="status"></p>
<script>
const form=document.getElementById('f'); const status=document.getElementById('status');
form.addEventListener('submit', async (e)=>{e.preventDefault(); const fd=new FormData(form);
const payload={project:'${project}', author:fd.get('author'), message:fd.get('message'), rating:Number(fd.get('rating'))};
const resp=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
status.textContent=resp.ok?'提交成功，可回到电脑查看':'提交失败';
});
</script></body></html>`;
    return sendHtml(res, html);
  }

  if (req.method === 'GET' && url.pathname.startsWith('/artifacts/screenshots/')) {
    const localPath = path.join(__dirname, url.pathname.replace(/^\//, ''));
    try {
      const file = await fs.readFile(localPath);
      const contentType = localPath.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
      res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
      return res.end(file);
    } catch {
      return sendJson(res, 404, { ok: false, message: 'Not found' });
    }
  }

  return sendJson(res, 404, { ok: false, message: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`Frontend feedback tool listening on http://${HOST}:${PORT}`);
});
