import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app.module';
import { HelloEventHandler } from './adapters/events/hello/hello.event-handler';

let app: INestApplicationContext | undefined;

async function getApp(): Promise<INestApplicationContext> {
  app ??= await NestFactory.createApplicationContext(AppModule);

  return app;
}

export async function resetHandlerContext(): Promise<void> {
  if (!app) {
    return;
  }

  await app.close();
  app = undefined;
}

export async function handler(event: unknown): Promise<{ message: string }> {
  const context = await getApp();

  return context.get(HelloEventHandler).handle(event);
}
