import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { Actor } from './actor.decorator';
import { AuthenticatedRequest } from '../authenticated-request';

type ParamFactory = (data: unknown, context: ExecutionContext) => ActorContext;

class Probe {
  handle(@Actor() actor: ActorContext): ActorContext {
    return actor;
  }
}

function contextOf(request: AuthenticatedRequest): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
}

function actorFactory(): ParamFactory {
  const parameters: Record<string, { factory: ParamFactory }> =
    Reflect.getMetadata(ROUTE_ARGS_METADATA, Probe, 'handle');
  return Object.values(parameters)[0].factory;
}

describe('Actor', () => {
  it('hands the authenticated actor to the handler', () => {
    const actor: ActorContext = {
      userId: 'user-1',
      companyId: 'company-1',
      role: UserRole.EMPLOYER,
    };

    expect(actorFactory()(undefined, contextOf({ headers: {}, actor }))).toBe(
      actor,
    );
  });

  it('denies access when the request carries no actor', () => {
    expect(() => actorFactory()(undefined, contextOf({ headers: {} }))).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
