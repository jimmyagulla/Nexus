import { INestApplication } from '@nestjs/common';
import serverlessExpress from '@codegenie/serverless-express';
import type { Handler } from 'aws-lambda';
import { createNestApp } from './create-app';

let nestApp: INestApplication | undefined;
let cachedServer: Handler | undefined;

export async function resetLambdaServerCache(): Promise<void> {
  await nestApp?.close();
  nestApp = undefined;
  cachedServer = undefined;
}

async function getServer(): Promise<Handler> {
  if (!cachedServer) {
    nestApp = await createNestApp();
    await nestApp.init();
    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    });
  }

  return cachedServer;
}

export const handler: Handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const server = await getServer();

  return server(event, context, callback);
};
