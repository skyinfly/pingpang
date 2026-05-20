import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { StorageAdapter, StoredObject, UploadInput } from './storage-adapter';

/**
 * Filesystem-backed storage. Files land under
 * apps/api/.local/uploads/<kind>/<key> and are served as static files
 * by Nest at /static/<kind>/<key>. Production should swap this adapter
 * for AliyunOssStorage / S3Storage via STORAGE_PROVIDER=oss.
 */
@Injectable()
export class LocalDiskStorage implements StorageAdapter {
  readonly name = 'local-disk';
  private readonly logger = new Logger(LocalDiskStorage.name);
  private readonly root: string;
  private readonly publicBase: string;

  constructor() {
    this.root =
      process.env.UPLOADS_LOCAL_ROOT ?? resolve(process.cwd(), '.local', 'uploads');
    this.publicBase = process.env.UPLOADS_PUBLIC_BASE ?? '/static/uploads';
  }

  async put(input: UploadInput): Promise<StoredObject> {
    const ext = sanitizeExtension(input.filename, input.mimeType);
    const key = `${input.kind}/${randomBytes(12).toString('hex')}${ext}`;
    const target = join(this.root, key);

    await mkdir(join(this.root, input.kind), { recursive: true });
    await writeFile(target, input.buffer);
    this.logger.log(`stored ${input.kind} -> ${target} (${input.buffer.length} bytes)`);

    return {
      key,
      url: `${this.publicBase}/${key}`,
    };
  }

  async delete(key: string): Promise<void> {
    const target = join(this.root, key);
    if (existsSync(target)) {
      await unlink(target);
    }
  }

  getRootPath() {
    return this.root;
  }

  getPublicBase() {
    return this.publicBase;
  }
}

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function sanitizeExtension(filename: string, mimeType: string) {
  const fromName = extname(filename || '').toLowerCase();
  if (ALLOWED_EXTENSIONS.has(fromName)) {
    return fromName;
  }
  return MIME_TO_EXT[mimeType] ?? '.bin';
}
