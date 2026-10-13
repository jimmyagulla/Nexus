import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiConfig, loadApiConfig } from './config/load-api-config';

/** Receipts travel as base64 in the JSON body, which the default limit would refuse. */
const REQUEST_BODY_LIMIT = '15mb';

export async function createNestApp(
  config: ApiConfig = loadApiConfig(),
): Promise<INestApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.useBodyParser('json', { limit: REQUEST_BODY_LIMIT });
  app.useBodyParser('urlencoded', { extended: true, limit: REQUEST_BODY_LIMIT });

  app.setGlobalPrefix(config.globalPrefix);

  const swagger = new DocumentBuilder()
    .setTitle('Hexagonal API')
    .setDescription('The Hexagonal Monorepo API description')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup(`${config.globalPrefix}/docs`, app, document);

  return app;
}
