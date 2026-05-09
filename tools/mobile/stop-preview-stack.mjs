import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const logsDir = path.resolve(repoRoot, '.local/run-logs');
const statePath = path.join(logsDir, 'preview-stack.json');

function stopPid(pid) {
  try {
    process.kill(pid);
    return true;
  } catch {
    return false;
  }
}

function readState() {
  if (!existsSync(statePath)) {
    return null;
  }

  return JSON.parse(readFileSync(statePath, 'utf8'));
}

function removeState() {
  if (existsSync(statePath)) {
    unlinkSync(statePath);
  }
}

function main() {
  const state = readState();

  if (!state) {
    console.log('No managed preview state found. Nothing to stop.');
    return;
  }

  const stopped = [];
  const skipped = [];

  if (state.admin?.managed && state.admin?.pid) {
    if (stopPid(state.admin.pid)) {
      stopped.push(`Admin preview PID ${state.admin.pid}`);
    } else {
      skipped.push(`Admin preview PID ${state.admin.pid} was not running`);
    }
  }

  if (state.h5?.managed && state.h5?.pid) {
    if (stopPid(state.h5.pid)) {
      stopped.push(`H5 preview PID ${state.h5.pid}`);
    } else {
      skipped.push(`H5 preview PID ${state.h5.pid} was not running`);
    }
  }

  if (state.api?.managed && state.api?.pid) {
    if (stopPid(state.api.pid)) {
      stopped.push(`API preview PID ${state.api.pid}`);
    } else {
      skipped.push(`API preview PID ${state.api.pid} was not running`);
    }
  } else if (state.api?.reused) {
    skipped.push('API was reused from an existing process, so it was left running');
  }

  removeState();

  if (stopped.length) {
    console.log(`Stopped: ${stopped.join('; ')}`);
  }

  if (skipped.length) {
    console.log(`Skipped: ${skipped.join('; ')}`);
  }
}

main();
