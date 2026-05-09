import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../apps/admin/dist');
const port = Number(process.env.ADMIN_PREVIEW_PORT || 5174);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function resolveType(filePath) {
  return contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function safePathFromUrl(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = cleanPath === '/' ? '/index.html' : cleanPath;
  const fullPath = path.resolve(rootDir, `.${normalized}`);

  if (!fullPath.startsWith(rootDir)) {
    return null;
  }

  return fullPath;
}

const server = createServer(async (req, res) => {
  const targetPath = safePathFromUrl(req.url || '/');

  if (!targetPath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const stats = await fs.stat(targetPath);
    const finalPath = stats.isDirectory() ? path.join(targetPath, 'index.html') : targetPath;

    res.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': resolveType(finalPath),
    });
    res.end(await fs.readFile(finalPath));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Admin preview server running at http://localhost:${port}`);
});
