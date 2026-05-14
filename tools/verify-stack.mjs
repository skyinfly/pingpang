// Non-destructive verification pass: typecheck + tests + builds across every
// workspace package. Does NOT touch the database (release:verify still owns
// the destructive `db:reset` path).

import { spawnSync } from 'node:child_process';

const commands = [
  ['Workspace smoke', 'node', ['tools/verify-workspace.mjs'], 'D:/CODE/pingpang'],
  ['Contracts typecheck', 'corepack', ['pnpm', '--filter', '@pingpang/contracts', 'exec', 'tsc', '--noEmit', '-p', 'tsconfig.build.json'], 'D:/CODE/pingpang'],
  ['API typecheck', 'corepack', ['pnpm', '--filter', '@pingpang/api', 'exec', 'tsc', '--noEmit', '-p', 'tsconfig.json'], 'D:/CODE/pingpang'],
  ['API build', 'corepack', ['pnpm', '--filter', '@pingpang/api', 'build'], 'D:/CODE/pingpang'],
  ['Admin typecheck', 'corepack', ['pnpm', '--filter', '@pingpang/admin', 'typecheck'], 'D:/CODE/pingpang'],
  ['Admin tests', 'corepack', ['pnpm', '--filter', '@pingpang/admin', 'test'], 'D:/CODE/pingpang'],
  ['Admin build', 'corepack', ['pnpm', '--filter', '@pingpang/admin', 'build'], 'D:/CODE/pingpang'],
  ['Mobile typecheck', 'D:/CODE/pingpang/apps/mobile/node_modules/.bin/vue-tsc.CMD', ['--noEmit', '-p', 'D:/CODE/pingpang/apps/mobile/tsconfig.json'], 'D:/CODE/pingpang'],
  ['Mobile tests', 'corepack', ['pnpm', '--filter', '@pingpang/mobile', 'test'], 'D:/CODE/pingpang'],
  ['Mobile h5 build', 'D:/CODE/pingpang/apps/mobile/node_modules/.bin/uni.CMD', ['build', '-p', 'h5'], 'D:/CODE/pingpang/apps/mobile'],
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
