import { Test } from '@nestjs/testing';
import { APP_GUARD, APP_PIPE, APP_INTERCEPTOR, APP_FILTER, ModulesContainer } from '@nestjs/core';
import { IHelloInboundPort } from '@hexagonal-monorepo-template/ports';
import { GetHelloUseCase } from '@hexagonal-monorepo-template/application';
import { AppModule } from './app.module';
import { AuthGuard } from '../adapters/http/common/guards/auth.guard';
import { AUTH_GUARD_OPTIONS } from '../adapters/http/common/guards/auth-guard-options';
import { createValidationPipe } from '../adapters/http/common/pipes/create-validation.pipe';
import { SuccessResponseInterceptor } from '../adapters/http/common/interceptors/success-response.interceptor';
import { ApiExceptionFilter } from '../adapters/http/common/filters/api-exception.filter';
import { API_CONFIG, loadApiConfig } from './config/load-api-config';

describe('AppModule', () => {
  it('wires the full hello chain (MockDb -> repository -> use case)', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const inboundPort = moduleRef.get<IHelloInboundPort>(IHelloInboundPort);

    expect(inboundPort).toBeInstanceOf(GetHelloUseCase);
    expect(inboundPort.execute().message).toBe('Hello API');
  });

  it('registers AuthGuard as APP_GUARD', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    const modules = app.get(ModulesContainer);
    const guardInstances = [...modules.values()].flatMap((mod) =>
      [...mod.providers.values()]
        .filter((wrapper) => {
          const token = wrapper.token;
          return (
            token === APP_GUARD ||
            (typeof token === 'string' && token.includes('APP_GUARD'))
          );
        })
        .map((wrapper) => wrapper.instance),
    );

    await app.close();

    expect(guardInstances.some((guard) => guard instanceof AuthGuard)).toBe(
      true,
    );
  });

  it('registers ValidationPipe as APP_PIPE', () => {
    const providers = Reflect.getMetadata('providers', AppModule) as Array<{
      provide?: unknown;
      useFactory?: unknown;
      useValue?: unknown;
    }>;

    const pipeProvider = providers.find((provider) => provider.provide === APP_PIPE);

    expect(pipeProvider?.useFactory).toBe(createValidationPipe);
    expect(pipeProvider?.useValue).toBeUndefined();
  });

  it('binds AUTH_GUARD_OPTIONS to allow-all default', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(API_CONFIG)
      .useValue(loadApiConfig({}))
      .compile();

    expect(moduleRef.get(AUTH_GUARD_OPTIONS)).toEqual({ allowed: true });
  });

  it('derives AUTH_GUARD_OPTIONS from API_CONFIG', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(API_CONFIG)
      .useValue({ port: 3000, authAllowed: false, globalPrefix: 'api' })
      .compile();

    expect(moduleRef.get(AUTH_GUARD_OPTIONS)).toEqual({ allowed: false });
  });

  it('registers SuccessResponseInterceptor as APP_INTERCEPTOR', () => {
    const providers = Reflect.getMetadata('providers', AppModule) as Array<{
      provide?: unknown;
      useClass?: unknown;
    }>;

    const interceptorProvider = providers.find(
      (provider) => provider.provide === APP_INTERCEPTOR,
    );

    expect(interceptorProvider?.useClass).toBe(SuccessResponseInterceptor);
  });

  it('registers ApiExceptionFilter as APP_FILTER', () => {
    const providers = Reflect.getMetadata('providers', AppModule) as Array<{
      provide?: unknown;
      useClass?: unknown;
    }>;

    const filterProvider = providers.find(
      (provider) => provider.provide === APP_FILTER,
    );

    expect(filterProvider?.useClass).toBe(ApiExceptionFilter);
  });
});
