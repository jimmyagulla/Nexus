import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiConfig, loadApiConfig } from './config/load-api-config';

export async function createNestApp(
  config: ApiConfig = loadApiConfig(),
): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

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
