import { BadRequestException, Inject, Injectable, PayloadTooLargeException } from '@nestjs/common';
import { LocalDiskStorage } from './local-disk-storage';
import { StorageAdapter, UploadInput, UploadKind } from './storage-adapter';

export const STORAGE_ADAPTER = 'STORAGE_ADAPTER';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES_BY_KIND: Record<UploadKind, number> = {
  avatar: 2 * 1024 * 1024, // 2MB
  'match-cover': 5 * 1024 * 1024, // 5MB
};

@Injectable()
export class UploadsService {
  constructor(@Inject(STORAGE_ADAPTER) private readonly storage: StorageAdapter) {}

  async upload(input: UploadInput) {
    if (!ALLOWED_MIME.has(input.mimeType)) {
      throw new BadRequestException(`Unsupported file type: ${input.mimeType}`);
    }

    const limit = MAX_BYTES_BY_KIND[input.kind];
    if (input.buffer.length > limit) {
      throw new PayloadTooLargeException(`${input.kind} file exceeds ${Math.round(limit / 1024 / 1024)}MB limit`);
    }

    return this.storage.put(input);
  }

  delete(key: string) {
    return this.storage.delete(key);
  }

  isLocalDisk() {
    return this.storage instanceof LocalDiskStorage;
  }

  getLocalStorageInfo() {
    if (this.storage instanceof LocalDiskStorage) {
      return {
        rootPath: this.storage.getRootPath(),
        publicBase: this.storage.getPublicBase(),
      };
    }
    return null;
  }
}
