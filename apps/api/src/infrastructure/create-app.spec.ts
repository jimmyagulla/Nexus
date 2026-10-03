import { afterEach, describe, expect, it } from 'vitest';
import type { INestApplication } from '@nestjs/common';
import { request as httpRequest } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createNestApp } from './create-app';

async function getResponse(
  app: INestApplication,
  path: string,
): Promise<{ status: number; body: string }> {
  const server = app.getHttpServer();
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  try {
    const { port } = server.address() as AddressInfo;

    return await new Promise((resolve, reject) => {
      httpRequest(
        { hostname: '127.0.0.1', port, path, method: 'GET' },
        (res) => {
          let data = '';
          res.on('data', (chunk: Buffer) => {
            data += chunk.toString();
          });
          res.on('end', () => {
            resolve({
              status: res.statusCode ?? 0,
              body: data,
            });
          });
        },
      )
        .on('error', reject)
        .end();
    });
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err: Error | undefined) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

describe('createNestApp', () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it('serves Swagger UI', async () => {
    app = await createNestApp();
    await app.init();

    const { status, body } = await getResponse(app, '/api/docs');

    expect(status).toBe(200);
    expect(body).toContain('Swagger');
  });
});
