import { Global, Module } from '@nestjs/common';
import { API_CONFIG, loadApiConfig } from './load-api-config';

@Global()
@Module({
  providers: [
    {
      provide: API_CONFIG,
      useFactory: () => loadApiConfig(),
    },
  ],
  exports: [API_CONFIG],
})
export class ApiConfigModule {}
