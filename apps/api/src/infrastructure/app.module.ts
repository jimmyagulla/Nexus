import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { IJwtVerifier } from '@hexagonal-monorepo-template/ports';
import { AuthGuard } from '../adapters/http/common/guards/auth/auth.guard';
import { createValidationPipe } from '../adapters/http/common/pipes/create-validation.pipe';
import { SuccessResponseInterceptor } from '../adapters/http/common/interceptors/success-response.interceptor';
import { ApiExceptionFilter } from '../adapters/http/common/filters/api-exception.filter';
import { API_CONFIG, loadApiConfig, type ApiConfig } from './config/load-api-config';
import { SupabaseJwtVerifier } from '../adapters/out/auth/supabase-jwt-verifier';
import { DenyAllJwtVerifier } from '../adapters/out/auth/deny-all-jwt-verifier';
import { ApiConfigModule } from './config/api-config.module';
import { AuditModule } from './audit/audit.module';
import { ClockModule } from './clock/clock.module';
import { CompanyModule } from './company/company.module';
import { CompanyPublicHolidaysModule } from './company-public-holidays/company-public-holidays.module';
import { CompanySettingsModule } from './company-settings/company-settings.module';
import { PrismaModule } from './prisma/prisma.module';

const persistence = loadApiConfig().persistence;

@Module({
  imports: [
    ApiConfigModule,
    ...(persistence === 'postgres' ? [PrismaModule] : []),
    ClockModule,
    AuditModule,
    CompanyModule,
    CompanySettingsModule,
    CompanyPublicHolidaysModule,
  ],
  providers: [
    {
      provide: IJwtVerifier,
      useFactory: (config: ApiConfig) => {
        if (config.supabaseJwksUrl === undefined) {
          return new DenyAllJwtVerifier();
        }
        return new SupabaseJwtVerifier(config.supabaseJwksUrl);
      },
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
