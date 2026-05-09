import { spawnSync } from 'node:child_process';
import net from 'node:net';

function isPortListening(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => {
      resolve(true);
    });

    server.once('listening', () => {
      server.close(() => resolve(false));
    });

    server.listen(port, '127.0.0.1');
  });
}

const commands = [
  ['corepack', ['pnpm', '--filter', '@pingpang/api', 'prisma:generate'], 'D:/CODE/pingpang'],
  ['corepack', ['pnpm', '--filter', '@pingpang/api', 'db:reset'], 'D:/CODE/pingpang'],
  ['corepack', ['pnpm', '--filter', '@pingpang/api', 'db:seed'], 'D:/CODE/pingpang'],
  ['corepack', ['pnpm', '--filter', '@pingpang/api', 'exec', 'tsc', '--noEmit', '-p', 'tsconfig.json'], 'D:/CODE/pingpang'],
  ['corepack', ['pnpm', '--filter', '@pingpang/api', 'exec', 'jest', '--runInBand', '--config', './test/jest-e2e.json'], 'D:/CODE/pingpang'],
  ['corepack', ['pnpm', '--filter', '@pingpang/mobile', 'test'], 'D:/CODE/pingpang'],
  ['corepack', ['pnpm', '--filter', '@pingpang/admin', 'test'], 'D:/CODE/pingpang'],
  ['corepack', ['pnpm', '--filter', '@pingpang/admin', 'typecheck'], 'D:/CODE/pingpang'],
  ['corepack', ['pnpm', '--filter', '@pingpang/admin', 'build'], 'D:/CODE/pingpang'],
  ['D:/CODE/pingpang/apps/mobile/node_modules/.bin/vue-tsc.CMD', ['--noEmit', '-p', 'D:/CODE/pingpang/apps/mobile/tsconfig.json'], 'D:/CODE/pingpang'],
  ['D:/CODE/pingpang/apps/mobile/node_modules/.bin/uni.CMD', ['build', '-p', 'h5'], 'D:/CODE/pingpang/apps/mobile'],
  [
    'D:/CODE/pingpang/apps/mobile/node_modules/.bin/uni.CMD',
    ['build', '-p', 'mp-weixin'],
    'D:/CODE/pingpang/apps/mobile',
    { VITE_API_BASE_URL_MP_WEIXIN: process.env.VITE_API_BASE_URL_MP_WEIXIN || 'https://api.pingpang.example.com' },
  ],
  ['node', ['tools/verify-workspace.mjs'], 'D:/CODE/pingpang'],
];

async function main() {
  if (await isPortListening(3000)) {
    console.error(
      'Port 3000 is already in use. Stop the local API preview before running release verification so Prisma can regenerate its Windows engine.',
    );
    process.exit(1);
  }

  for (const [command, args, cwd, env] of commands) {
    console.log(`> ${command} ${args.join(' ')}`);
    const result = spawnSync(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: {
        ...process.env,
        ...(env ?? {}),
      },
    });

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }

  console.log('release verification completed');
}

void main();
