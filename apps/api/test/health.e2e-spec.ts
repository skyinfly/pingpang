import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('HealthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns ok', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', service: 'pingpang-api' });
  });

  it('GET /health/live returns live without any I/O', async () => {
    await request(app.getHttpServer())
      .get('/health/live')
      .expect(200)
      .expect({ status: 'live', service: 'pingpang-api' });
  });

  it('GET /health/ready probes DB + Redis', async () => {
    const response = await request(app.getHttpServer())
      .get('/health/ready')
      .expect(200);

    expect(response.body.status).toBe('ready');
    expect(response.body.checks.db.ok).toBe(true);
    expect(response.body.checks.redis.ok).toBe(true);
  });

  it('emits x-request-id on responses for log correlation', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);
    expect(response.headers['x-request-id']).toMatch(/[0-9a-f-]{6,}/);
  });

  it('echoes the incoming x-request-id when provided', async () => {
    const incoming = 'caller-supplied-id-1234';
    const response = await request(app.getHttpServer())
      .get('/health')
      .set('x-request-id', incoming)
      .expect(200);
    expect(response.headers['x-request-id']).toBe(incoming);
  });
});
