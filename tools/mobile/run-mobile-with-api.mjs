import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const options = new Map();

for (let index = 0; index < args.length; index += 1) {
  const current = args[index];

  if (!current.startsWith('--')) {
    continue;
  }

  options.set(current.slice(2), args[index + 1] ?? '');
  index += 1;
}

const platform = options.get('platform') || 'h5';
const command = options.get('command') || 'dev';
const apiHost = options.get('api-host') || '';
const apiPort = options.get('api-port') || '3000';
const apiProtocol = options.get('api-protocol') || 'http';
const apiBaseUrl =
  options.get('api-base-url') ||
  (apiHost ? `${apiProtocol}://${apiHost}:${apiPort}` : '') ||
  process.env.VITE_API_BASE_URL ||
  '';
const shouldPrintConfig = options.get('print-config') === 'true';

const scriptName =
  command === 'build'
    ? platform === 'mp-weixin'
      ? 'build:mp-weixin'
      : 'build:h5'
    : platform === 'mp-weixin'
      ? 'dev:mp-weixin'
      : 'dev:h5';

if (shouldPrintConfig) {
  console.log(
    JSON.stringify(
      {
        platform,
        command,
        scriptName,
        apiBaseUrl,
      },
      null,
      2,
    ),
  );
}

const child = spawn(
  process.platform === 'win32' ? 'corepack.cmd' : 'corepack',
  ['pnpm', '--filter', '@pingpang/mobile', scriptName],
  {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      ...(apiBaseUrl ? { VITE_API_BASE_URL: apiBaseUrl } : {}),
    },
  },
);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});