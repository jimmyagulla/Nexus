import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { LOCAL_DEV_COMPANY_ID } from '@hexagonal-monorepo-template/adapters';
import { IEmployeeDirectory } from '@hexagonal-monorepo-template/ports';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { EmployeeDirectoryModule } from './employee-directory.module';

@Global()
@Module({})
class TestGlobalsModule {}

function compile(env: Record<string, string>): Promise<TestingModule> {
  const testGlobals: DynamicModule = {
    module: TestGlobalsModule,
    global: true,
    providers: [{ provide: API_CONFIG, useValue: loadApiConfig(env) }],
    exports: [API_CONFIG],
  };

  return Test.createTestingModule({
    imports: [testGlobals, EmployeeDirectoryModule],
  }).compile();
}

describe('EmployeeDirectoryModule', () => {
  it('provides the employee directory', async () => {
    const moduleRef = await compile({});

    expect(moduleRef.get(IEmployeeDirectory)).toBeDefined();
  });

  it('knows no employee until the employee file module feeds it', async () => {
    const moduleRef = await compile({});

    expect(
      await moduleRef
        .get<IEmployeeDirectory>(IEmployeeDirectory)
        .listInCompany(LOCAL_DEV_COMPANY_ID),
    ).toEqual([]);
  });

  it('offers the local development employees when authentication is disabled', async () => {
    const moduleRef = await compile({ AUTH_DISABLED: 'true' });

    const employees = await moduleRef
      .get<IEmployeeDirectory>(IEmployeeDirectory)
      .listInCompany(LOCAL_DEV_COMPANY_ID);

    expect(employees.length).toBeGreaterThan(0);
  });
});
