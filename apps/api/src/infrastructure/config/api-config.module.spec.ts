import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { ApiConfigModule } from './api-config.module';
import { API_CONFIG, type ApiConfig } from './load-api-config';

const INJECTED_CONFIG = Symbol('INJECTED_CONFIG');

@Module({
  providers: [
    {
      provide: INJECTED_CONFIG,
      useFactory: (config: ApiConfig) => config,
      inject: [API_CONFIG],
    },
  ],
})
class ConfigConsumerModule {}

const initialPrefix = process.env.API_GLOBAL_PREFIX;

describe('ApiConfigModule', () => {
  afterEach(() => {
    if (initialPrefix === undefined) {
      delete process.env.API_GLOBAL_PREFIX;
      return;
    }
    process.env.API_GLOBAL_PREFIX = initialPrefix;
  });

  it('assembles the configuration from the process environment', async () => {
    process.env.API_GLOBAL_PREFIX = 'v9';

    const moduleRef = await Test.createTestingModule({
      imports: [ApiConfigModule],
    }).compile();

    expect(moduleRef.get<ApiConfig>(API_CONFIG).globalPrefix).toBe('v9');
  });

  it('rejects an invalid environment instead of starting half configured', async () => {
    process.env.API_GLOBAL_PREFIX = '   ';

    await expect(
      Test.createTestingModule({ imports: [ApiConfigModule] }).compile(),
    ).rejects.toThrow('Invalid API_GLOBAL_PREFIX: value is empty');
  });

  it('offers the configuration to a module that does not import it', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ApiConfigModule, ConfigConsumerModule],
    }).compile();

    expect(moduleRef.get(INJECTED_CONFIG)).toBe(moduleRef.get(API_CONFIG));
  });
});
