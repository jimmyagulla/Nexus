import { Test } from '@nestjs/testing';
import { ModulesContainer } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { CabinetExchangeController } from '../adapters/http/cabinet-exchange/cabinet-exchange.controller';
import { ROLES_KEY } from '../adapters/http/common/guards/roles/roles.decorator';
import { AppModule } from './app.module';

type Handler = {
  controller: string;
  name: string;
  roles: readonly UserRole[] | undefined;
};

type ControllerClass = {
  name: string;
  prototype: Record<string, unknown>;
};

async function routeHandlers(): Promise<Handler[]> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const controllers = [...moduleRef.get(ModulesContainer).values()].flatMap(
    (module) =>
      [...module.controllers.values()].map(
        (wrapper) => wrapper.metatype as unknown as ControllerClass,
      ),
  );

  return controllers.flatMap((controller) =>
    Object.getOwnPropertyNames(controller.prototype)
      .filter((name) => name !== 'constructor')
      .map((name) => ({ name, handler: controller.prototype[name] as object }))
      .filter(({ handler }) => Reflect.hasMetadata('path', handler))
      .map(({ name, handler }) => ({
        controller: controller.name,
        name,
        roles:
          (Reflect.getMetadata(ROLES_KEY, handler) as UserRole[] | undefined) ??
          (Reflect.getMetadata(ROLES_KEY, controller) as
            | UserRole[]
            | undefined),
      })),
  );
}

describe('what the cabinet can reach', () => {
  it('reaches nothing of the company space: every other route names the roles it admits, without the cabinet', async () => {
    const others = (await routeHandlers()).filter(
      (handler) => handler.controller !== CabinetExchangeController.name,
    );

    expect(others.length).toBeGreaterThan(0);
    const reachable = others
      .filter(
        (handler) =>
          handler.roles === undefined ||
          handler.roles.includes(UserRole.ACCOUNTANT),
      )
      .map((handler) => `${handler.controller}.${handler.name}`);
    // Creating a company is refused to any actor who already belongs to one.
    expect(reachable).toEqual(['CompanyController.create']);
  });

  it('opens to the cabinet only the exchange routes meant for it', async () => {
    const forCabinet = (await routeHandlers())
      .filter(
        (handler) =>
          handler.controller === CabinetExchangeController.name &&
          handler.roles?.includes(UserRole.ACCOUNTANT),
      )
      .map((handler) => handler.name)
      .sort();

    expect(forCabinet).toEqual(
      [
        'allHistory',
        'consult',
        'depositDocument',
        'downloadFile',
        'exchangeHistory',
        'listAll',
      ].sort(),
    );
  });

  it('never opens an exchange route to an employee', async () => {
    const forEmployee = (await routeHandlers()).filter(
      (handler) =>
        handler.controller === CabinetExchangeController.name &&
        (handler.roles === undefined ||
          handler.roles.includes(UserRole.EMPLOYEE)),
    );

    expect(forEmployee).toEqual([]);
  });
});
