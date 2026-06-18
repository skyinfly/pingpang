// Non-destructive verification pass: typecheck + tests + builds across every
// workspace package. Does NOT touch the database (release:verify still owns
// the destructive `db:reset` path).

import { spawnSync } from 'node:child_process';

const repoRoot = new URL('..', import.meta.url).pathname;

const isWin = process.platform === 'win32';
const vueTscBin = isWin ? 'apps/mobile/node_modules/.bin/vue-tsc.CMD' : 'apps/mobile/node_modules/.bin/vue-tsc';
const uniBin = isWin ? 'node_modules/.bin/uni.CMD' : 'node_modules/.bin/uni';

const commands = [
  ['Workspace smoke', 'node', ['tools/verify-workspace.mjs'], repoRoot],
  ['Contracts typecheck', 'corepack', ['pnpm', '--filter', '@pingpang/contracts', 'exec', 'tsc', '--noEmit', '-p', 'tsconfig.build.json'], repoRoot],
  ['API typecheck', 'corepack', ['pnpm', '--filter', '@pingpang/api', 'exec', 'tsc', '--noEmit', '-p', 'tsconfig.json'], repoRoot],
  ['API build', 'corepack', ['pnpm', '--filter', '@pingpang/api', 'build'], repoRoot],
  ['Admin typecheck', 'corepack', ['pnpm', '--filter', '@pingpang/admin', 'typecheck'], repoRoot],
  ['Admin tests', 'corepack', ['pnpm', '--filter', '@pingpang/admin', 'test'], repoRoot],
  ['Admin build', 'corepack', ['pnpm', '--filter', '@pingpang/admin', 'build'], repoRoot],
  ['Mobile typecheck', vueTscBin, ['--noEmit', '-p', 'apps/mobile/tsconfig.json'], repoRoot],
  ['Mobile tests', 'corepack', ['pnpm', '--filter', '@pingpang/mobile', 'test'], repoRoot],
  ['Mobile h5 build', uniBin, ['build', '-p', 'h5'], new URL('../apps/mobile', import.meta.url).pathname],
];

async function main() {
  let failed = 0;

  for (const [label, command, args, cwd] of commands) {
    process.stdout.write(`\n=== ${label} ===\n`);
    const result = spawnSync(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
    });

    if (result.status !== 0) {
      console.error(`\n[verify-stack] ${label} failed with exit code ${result.status}`);
      failed += 1;
    }
  }

  if (failed > 0) {
    console.error(`\nverify-stack: ${failed} step(s) failed.`);
    process.exit(1);
  }

  console.log('\nverify-stack: all steps passed.');
}

void main();
