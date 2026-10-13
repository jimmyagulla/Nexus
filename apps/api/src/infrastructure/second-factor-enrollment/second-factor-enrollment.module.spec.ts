import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { ConfirmSecondFactorEnrollmentUseCase } from '@hexagonal-monorepo-template/application';
import { IConfirmSecondFactorEnrollment } from '@hexagonal-monorepo-template/ports';
import { AccountModule } from '../account/account.module';
import { ClockModule } from '../clock/clock.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { EmployeeModule } from '../employee/employee.module';
import { IdGeneratorModule } from '../id-generator/id-generator.module';
import { SecondFactorModule } from '../second-factor/second-factor.module';
import { SecondFactorEnrollmentModule } from './second-factor-enrollment.module';

@Global()
@Module({})
class TestGlobalsModule {}

function testGlobals(): DynamicModule {
  return {
    module: TestGlobalsModule,
    global: true,
    providers: [{ provide: API_CONFIG, useValue: loadApiConfig({}) }],
    exports: [API_CONFIG],
  };
}

describe('SecondFactorEnrollmentModule', () => {
  it('wires the enrollment confirmation use case', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        testGlobals(),
        ClockModule,
        IdGeneratorModule,
        AccountModule,
        EmployeeModule,
        SecondFactorModule,
        SecondFactorEnrollmentModule,
      ],
    }).compile();

    expect(moduleRef.get(IConfirmSecondFactorEnrollment)).toBeInstanceOf(
      ConfirmSecondFactorEnrollmentUseCase,
    );
  });
});
