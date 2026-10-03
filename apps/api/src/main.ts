import { Logger } from '@nestjs/common';
import { createNestApp } from './infrastructure/create-app';
import { loadApiConfig } from './infrastructure/config/load-api-config';

async function bootstrap() {
  const config = loadApiConfig();
  const app = await createNestApp(config);

  await app.listen(config.port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${config.port}/${config.globalPrefix}`,
  );
  Logger.log(
    `Swagger documentation is available on: http://localhost:${config.port}/${config.globalPrefix}/docs`,
  );
}

bootstrap();
