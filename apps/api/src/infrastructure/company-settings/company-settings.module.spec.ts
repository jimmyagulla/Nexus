import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import {
  ICompanyRepository,
  IGetCompanySettings,
  ISetNonWorkingWeekdays,
} from '@hexagonal-monorepo-template/ports';
import { ClockModule } from '../clock/clock.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { CompanySettingsModule } from './company-settings.module';

@Global()
@Module({})
class TestGlobalsModule {}

const testGlobals: DynamicModule = {
  module: TestGlobalsModule,
  global: true,
  providers: [{ provide: API_CONFIG, useValue: loadApiConfig({}) }],
  exports: [API_CONFIG],
};

function compile(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      testGlobals,
      ClockModule,
      CompanySettingsModule,
    ],
  }).compile();
}

describe('CompanySettingsModule', () => {
  it('wires the company settings use cases', async () => {
    const moduleRef = await compile();

    expect(moduleRef.get(IGetCompanySettings)).toBeDefined();
    expect(moduleRef.get(ISetNonWorkingWeekdays)).toBeDefined();
  });

  it('reuses the company repository of the company module', async () => {
    const moduleRef = await compile();

    expect(moduleRef.get(ICompanyRepository)).toBeDefined();
  });
});
