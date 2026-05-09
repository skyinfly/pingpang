import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  getStatus() {
    return 'mock-ready';
  }
}
