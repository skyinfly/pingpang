import { spawn } from 'node:child_process';
import { mkdirSync, openSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const logsDir = path.resolve(repoRoot, '.local/run-logs');
const statePath = path.join(logsDir, 'preview-stack.json');

mkdirSync(logsDir, { recursive: true });

const apiPort = 3000;
const h5Port = 4173;
const adminPort = 5174;

function openLogFile(name) {
  return openSync(path.join(logsDir, name), 'a');
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: 'inherit',
      shell: false,
      ...options,
    });

    child.on('exit', (code) => {
      if ((code ?? 0) === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}`));
    });
  });
}

function runAndCapture(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      shell: false,
      ...options,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (chunk) => {
      stdout += String(chunk);
    });

    child.stderr?.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('exit', (code) => {
      if ((code ?? 0) === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}\n${stderr || stdout}`.trim(),
        ),
      );
    });
  });
}

async function isHealthy(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

function spawnDetached(file, args, options = {}) {
  const child = spawn(file, args, {
    cwd: repoRoot,
    detached: true,
    windowsHide: true,
    stdio: options.stdio ?? 'ignore',
    env: {
      ...process.env,
      ...(options.env ?? {}),
    },
  });

  child.unref();
  return child;
}

async function killPortWithPowerShell(port) {
  const script = [
    `$portPid=(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1)`,
    'if($portPid){ Stop-Process -Id $portPid -Force -ErrorAction SilentlyContinue }',
  ].join('; ');

  await run('powershell', ['-NoProfile', '-Command', script]);
}

async function getListeningPid(port) {
  const script = [
    `$portPid=(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1)`,
    'if($portPid){ Write-Output $portPid }',
  ].join('; ');
  const result = await runAndCapture('powershell', ['-NoProfile', '-Command', script]);
  const parsed = Number(result.stdout.trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function writeState(state) {
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

async function waitForHealth(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isHealthy(url)) {
      return true;
    }

    await wait(1000);
  }

  return false;
}

async function ensureApiRunning() {
  const healthUrl = `http://localhost:${apiPort}/health`;

  if (await isHealthy(healthUrl)) {
    return {
      managed: false,
      pid: await getListeningPid(apiPort),
      reused: true,
    };
  }

  await killPortWithPowerShell(apiPort);

  const out = openLogFile('api.out.log');
  const err = openLogFile('api.err.log');

  const command = process.platform === 'win32' ? 'corepack.cmd' : 'corepack';
  spawnDetached(command, ['pnpm', '--filter', '@pingpang/api', 'exec', 'ts-node', 'src/main.ts'], {
    stdio: ['ignore', out, err],
    env: {
      PORT: String(apiPort),
    },
  });

  const healthy = await waitForHealth(healthUrl, 15000);

  if (!healthy) {
    throw new Error(`API did not become healthy on ${healthUrl} within 15s`);
  }

  return {
    managed: true,
    pid: await getListeningPid(apiPort),
    reused: false,
  };
}

async function restartH5Preview() {
  await run(process.platform === 'win32' ? 'corepack.cmd' : 'corepack', [
    'pnpm',
    '--filter',
    '@pingpang/mobile',
    'build:h5',
  ]);

  await killPortWithPowerShell(h5Port);

  const out = openLogFile('h5.out.log');
  const err = openLogFile('h5.err.log');

  spawnDetached('node', [path.resolve(repoRoot, 'tools/mobile/serve-h5-preview.mjs')], {
    stdio: ['ignore', out, err],
    env: {
      H5_PREVIEW_PORT: String(h5Port),
    },
  });

  const healthy = await waitForHealth(`http://localhost:${h5Port}/`, 10000);

  if (!healthy) {
    throw new Error(`H5 preview did not become ready on http://localhost:${h5Port}/ within 10s`);
  }

  return {
    managed: true,
    pid: await getListeningPid(h5Port),
  };
}

async function restartAdminPreview() {
  await run(process.platform === 'win32' ? 'corepack.cmd' : 'corepack', [
    'pnpm',
    '--filter',
    '@pingpang/admin',
    'build',
  ]);

  await killPortWithPowerShell(adminPort);

  const out = openLogFile('admin.out.log');
  const err = openLogFile('admin.err.log');

  spawnDetached('node', [path.resolve(repoRoot, 'tools/admin/serve-admin-preview.mjs')], {
    stdio: ['ignore', out, err],
    env: {
      ADMIN_PREVIEW_PORT: String(adminPort),
    },
  });

  const healthy = await waitForHealth(`http://localhost:${adminPort}/`, 10000);

  if (!healthy) {
    throw new Error(`Admin preview did not become ready on http://localhost:${adminPort}/ within 10s`);
  }

  return {
    managed: true,
    pid: await getListeningPid(adminPort),
  };
}

async function main() {
  const apiState = await ensureApiRunning();
  const h5State = await restartH5Preview();
  const adminState = await restartAdminPreview();
  const startedAt = new Date().toISOString();
  const h5Url = `http://localhost:${h5Port}/?v=${Date.now()}`;
  const adminUrl = `http://localhost:${adminPort}/?v=${Date.now()}`;

  writeState({
    startedAt,
    logsDir,
    api: {
      port: apiPort,
      pid: apiState.pid,
      managed: apiState.managed,
      reused: apiState.reused,
    },
    h5: {
      port: h5Port,
      pid: h5State.pid,
      managed: h5State.managed,
    },
    admin: {
      port: adminPort,
      pid: adminState.pid,
      managed: adminState.managed,
    },
  });

  console.log('');
  console.log('Preview stack is ready.');
  console.log(`H5:  ${h5Url}`);
  console.log(`Admin: ${adminUrl}`);
  console.log(`API: http://localhost:${apiPort}/health`);
  console.log(`API mode: ${apiState.reused ? 'reused existing process' : 'started preview process'}`);
  console.log(`Logs: ${logsDir}`);
  console.log(`State: ${statePath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
