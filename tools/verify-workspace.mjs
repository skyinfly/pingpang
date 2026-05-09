import { access } from 'node:fs/promises';
import assert from 'node:assert/strict';

const required = [
  'package.json',
  'pnpm-workspace.yaml',
  'tsconfig.base.json',
  '.editorconfig',
  '.gitignore',
  '.env.example',
  'apps/mobile/package.json',
  'apps/admin/package.json',
  'apps/admin/src/App.vue',
  'apps/api/package.json',
  'packages/contracts/package.json',
  'packages/contracts/src/index.ts',
];

for (const file of required) {
  try {
    await access(new URL(`../${file}`, import.meta.url));
  } catch {
    assert.fail(`missing required workspace file: ${file}`);
  }
}

console.log('workspace smoke check passed');
