import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../apps/mobile/dist/build/h5');
const port = Number(process.env.H5_PREVIEW_PORT || 4173);
const rpxToPxRatio = Number(process.env.H5_PREVIEW_RPX_RATIO || 0.5);

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

function transformPreviewCss(contents) {
  return contents.replace(/(-?\d*\.?\d+)rpx/g, (_match, value) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return `${value}rpx`;
    }

    return `${numericValue * rpxToPxRatio}px`;
  });
}

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
    const type = resolveType(finalPath);
    const file =
      path.extname(finalPath).toLowerCase() === '.css'
        ? Buffer.from(transformPreviewCss(await fs.readFile(finalPath, 'utf8')), 'utf8')
        : await fs.readFile(finalPath);

    res.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': type,
    });
    res.end(file);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`H5 preview server running at http://localhost:${port}`);
});
