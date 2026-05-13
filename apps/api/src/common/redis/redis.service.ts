import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit, Optional } from '@nestjs/common';
import Redis, { type Redis as RedisClient, type RedisOptions } from 'ioredis';

export const REDIS_OPTIONS = 'REDIS_OPTIONS';

export type RedisModuleOptions = {
  url?: string;
};

interface KvStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  incrementWithTtl(key: string, ttlSeconds: number): Promise<number>;
}

class InMemoryStore implements KvStore {
  private readonly entries = new Map<string, { value: string; expiresAt: number | null }>();

  async get(key: string) {
    const entry = this.entries.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.entries.set(key, { value, expiresAt });
  }

  async delete(key: string) {
    this.entries.delete(key);
  }

  async exists(key: string) {
    return (await this.get(key)) !== null;
  }

  async incrementWithTtl(key: string, ttlSeconds: number) {
    const current = Number((await this.get(key)) ?? '0');
    const next = current + 1;
    await this.set(key, String(next), ttlSeconds);
    return next;
  }
}

class IoRedisStore implements KvStore {
  constructor(private readonly client: RedisClient) {}

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, value, 'EX', ttlSeconds);
      return;
    }

    await this.client.set(key, value);
  }

  async delete(key: string) {
    await this.client.del(key);
  }

  async exists(key: string) {
    return (await this.client.exists(key)) > 0;
  }

  async incrementWithTtl(key: string, ttlSeconds: number) {
    const next = await this.client.incr(key);
    if (next === 1) {
      await this.client.expire(key, ttlSeconds);
    }
    return next;
  }
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private store: KvStore = new InMemoryStore();
  private client: RedisClient | null = null;
  private mode: 'redis' | 'memory' = 'memory';

  constructor(@Optional() @Inject(REDIS_OPTIONS) private readonly options?: RedisModuleOptions) {}

  async onModuleInit() {
    const url = this.options?.url ?? process.env.REDIS_URL;

    if (!url) {
      this.logger.warn('REDIS_URL not set; using in-memory fallback (single-process only).');
      return;
    }

    const redisOptions: RedisOptions = {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false,
    };

    try {
      const client = new Redis(url, redisOptions);
      client.on('error', (error) => {
        this.logger.error(`Redis error: ${error.message}`);
      });
      await client.connect();
      this.client = client;
      this.store = new IoRedisStore(client);
      this.mode = 'redis';
      this.logger.log(`Connected to Redis at ${url.replace(/:\/\/.+@/, '://***@')}`);
    } catch (error) {
      this.logger.warn(`Failed to connect to Redis (${(error as Error).message}); falling back to in-memory store.`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit().catch(() => undefined);
      this.client = null;
    }
  }

  getStatus() {
    return this.mode === 'redis' ? 'connected' : 'memory-fallback';
  }

  get(key: string) {
    return this.store.get(key);
  }

  set(key: string, value: string, ttlSeconds?: number) {
    return this.store.set(key, value, ttlSeconds);
  }

  delete(key: string) {
    return this.store.delete(key);
  }

  exists(key: string) {
    return this.store.exists(key);
  }

  incrementWithTtl(key: string, ttlSeconds: number) {
    return this.store.incrementWithTtl(key, ttlSeconds);
  }
}
