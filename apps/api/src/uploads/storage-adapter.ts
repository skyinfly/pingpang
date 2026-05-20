export type UploadKind = 'avatar' | 'match-cover';

export type StoredObject = {
  key: string;
  url: string;
};

export type UploadInput = {
  kind: UploadKind;
  filename: string;
  buffer: Buffer;
  mimeType: string;
};

export interface StorageAdapter {
  readonly name: string;
  put(input: UploadInput): Promise<StoredObject>;
  delete(key: string): Promise<void>;
}
