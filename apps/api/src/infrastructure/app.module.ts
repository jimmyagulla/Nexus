import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AuthGuard } from '../adapters/http/common/guards/auth.guard';
import { AUTH_GUARD_OPTIONS } from '../adapters/http/common/guards/auth-guard-options';
import { createValidationPipe } from '../adapters/http/common/pipes/create-validation.pipe';
import { SuccessResponseInterceptor } from '../adapters/http/common/interceptors/success-response.interceptor';
import { ApiExceptionFilter } from '../adapters/http/common/filters/api-exception.filter';
import { API_CONFIG, loadApiConfig, type ApiConfig } from './config/load-api-config';

@Module({
  providers: [
    {
      provide: API_CONFIG,
      useFactory: () => loadApiConfig(),
    },
    {
      provide: AUTH_GUARD_OPTIONS,
      useFactory: (config: ApiConfig) => ({
        allowed: config.authAllowed,
      }),
      inject: [API_CONFIG],
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useFactory: createValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class AppModule {}
