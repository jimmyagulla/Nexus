import { DynamicModule, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { InMemoryPresenceRepository } from '@hexagonal-monorepo-template/adapters';
import {
  IAbsenceFactSource,
  IAdjustPresenceWorkedDays,
  ICompanyRepository,
  IGetPresence,
  IHoursFactSource,
  IListPresences,
  ISickLeaveDocumentSource,
  IOpenPresence,
  IPresenceRepository,
} from '@hexagonal-monorepo-template/ports';
import { ClockModule } from '../clock/clock.module';
import { API_CONFIG, loadApiConfig } from '../config/load-api-config';
import { PresenceModule } from './presence.module';

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
    imports: [testGlobals, ClockModule, PresenceModule],
  }).compile();
}

describe('PresenceModule', () => {
  it('wires the presence use cases', async () => {
    const moduleRef = await compile();

    expect(moduleRef.get(IOpenPresence)).toBeDefined();
    expect(moduleRef.get(IListPresences)).toBeDefined();
    expect(moduleRef.get(IAdjustPresenceWorkedDays)).toBeDefined();
    expect(moduleRef.get(IGetPresence)).toBeDefined();
  });

  it('reuses the company repository of the company module', async () => {
    const moduleRef = await compile();

    expect(moduleRef.get(ICompanyRepository)).toBeDefined();
  });

  it('reads the absence facts through the absence fact source', async () => {
    const moduleRef = await compile();

    expect(moduleRef.get(IAbsenceFactSource)).toBeDefined();
  });

  it('reads the hours and the sick leaves through their own sources', async () => {
    const moduleRef = await compile();

    expect(moduleRef.get(IHoursFactSource)).toBeDefined();
    expect(moduleRef.get(ISickLeaveDocumentSource)).toBeDefined();
  });

  it('keeps the presences in memory when the persistence is not postgres', async () => {
    const moduleRef = await compile();

    expect(moduleRef.get(IPresenceRepository)).toBeInstanceOf(
      InMemoryPresenceRepository,
    );
  });
});
