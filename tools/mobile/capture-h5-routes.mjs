import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const outputDir = path.resolve(repoRoot, '.local/run-logs/h5-routes');
const baseUrl = process.env.H5_CAPTURE_BASE_URL || 'http://localhost:4173/';

const routes = [
  { name: 'home', hash: '#/pages/home/index' },
  { name: 'square', hash: '#/pages/square/index' },
  { name: 'match-detail', hash: '#/pages/match-detail/index?id=match-seed-1' },
  { name: 'create-match', hash: '#/pages/create-match/index' },
  { name: 'login', hash: '#/pages/login/index' },
  { name: 'messages', hash: '#/pages/messages/index' },
  { name: 'profile', hash: '#/pages/profile/index' },
  { name: 'chat', hash: '#/pages/chat/index?threadId=match-seed-1' },
];

mkdirSync(outputDir, { recursive: true });

function resolveEdgePath() {
  const candidates = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function screenshot(edgePath, url, outputPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(edgePath, ['--headless', '--disable-gpu', '--virtual-time-budget=8000', `--screenshot=${outputPath}`, url], {
      cwd: repoRoot,
      windowsHide: true,
      stdio: 'ignore',
    });

    child.on('exit', (code) => {
      if ((code ?? 0) === 0) {
        resolve();
        return;
      }

      reject(new Error(`Failed to capture ${url} with code ${code ?? 'unknown'}`));
    });
  });
}

async function main() {
  const edgePath = resolveEdgePath();

  if (!edgePath) {
    throw new Error('Microsoft Edge was not found on this machine');
  }

  const captured = [];

  for (const route of routes) {
    const url = `${baseUrl}${route.hash}`;
    const outputPath = path.join(outputDir, `${route.name}.png`);
    await screenshot(edgePath, url, outputPath);
    captured.push(outputPath);
  }

  console.log(`Captured ${captured.length} H5 preview routes.`);
  for (const outputPath of captured) {
    console.log(outputPath);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
