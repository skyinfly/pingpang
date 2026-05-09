import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = fileURLToPath(new URL('.', import.meta.url));

function loadEnvFile() {
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(scriptDir, '../../../.env'),
  ];

  for (const envPath of candidates) {
    if (!existsSync(envPath)) {
      continue;
    }

    const contents = readFileSync(envPath, 'utf8');

    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();

      if (!line || line.startsWith('#')) {
        continue;
      }

      const separatorIndex = line.indexOf('=');

      if (separatorIndex === -1) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }

    return;
  }
}

loadEnvFile();

const prismaBinary = process.platform === 'win32' ? 'prisma.cmd' : 'prisma';
const localPrismaBinary = resolve(process.cwd(), 'node_modules', '.bin', prismaBinary);
const prismaCommand = existsSync(localPrismaBinary) ? localPrismaBinary : prismaBinary;

const result = spawnSync(prismaCommand, process.argv.slice(2), {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
