import { describe, expect, it } from 'vitest';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { i18n } from '../ui/i18n/i18n';
import { createSecondFactorComposition } from './second-factor.composition';

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

function compositionFor(
  actor: ActorContext | null = employee,
  token: string | null = 'jwt',
) {
  const http = new InMemoryHttpClient();
  http.reply('post', 'second-factor/enrollment', {
    status: 201,
    data: { secret: 'ABCDEFGH', provisioningUri: 'otpauth://x' },
  });
  http.reply('post', 'second-factor/enrollment/confirmation', {
    status: 201,
    data: { enrolled: true, recoveryCodes: ['ABCDE23456'] },
  });
  http.reply('get', 'second-factor/status', {
    status: 200,
    data: { step: 'ENROLL' },
  });
  http.reply('post', 'second-factor/challenge', {
    status: 201,
    data: { step: 'VERIFY' },
  });
  http.reply('post', 'second-factor/verification', {
    status: 201,
    data: { verified: true },
  });
  return {
    http,
    deps: createSecondFactorComposition(
      http,
      new InMemorySessionGateway(token, actor),
    ),
  };
}

describe('createSecondFactorComposition', () => {
  it('does not let its caller choose the api the http client targets', () => {
    expect(createSecondFactorComposition.length).toBe(2);
  });

  it('wires a controller that begins the enrollment of the session user', async () => {
    const { deps, http } = compositionFor();

    await expect(deps.controller.beginEnrollment()).resolves.toEqual({
      secret: 'ABCDEFGH',
      provisioningUri: 'otpauth://x',
    });
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'second-factor/enrollment',
        data: undefined,
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('wires a controller that confirms the enrollment with the code', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.confirmEnrollment('123456');

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'second-factor/enrollment/confirmation',
        data: { code: '123456' },
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('wires a controller that reads the step the session user still owes', async () => {
    const { deps, http } = compositionFor();

    await expect(deps.controller.getStatus()).resolves.toEqual({
      step: 'ENROLL',
    });
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'second-factor/status',
        data: undefined,
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('wires a controller that opens the challenge of the session user', async () => {
    const { deps, http } = compositionFor();

    await expect(deps.controller.openChallenge()).resolves.toEqual({
      step: 'VERIFY',
    });
    expect(http.calls.map((call) => call.url)).toEqual([
      'second-factor/challenge',
    ]);
  });

  it('wires a controller that verifies the second factor with a code', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.verify('ABCDE-23456');

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'second-factor/verification',
        data: { code: 'ABCDE-23456' },
        config: { headers: { Authorization: 'Bearer jwt' } },
      },
    ]);
  });

  it('provides the step presenter the routing needs', () => {
    const { deps } = compositionFor();

    expect(deps.stepPresenter.present({ step: 'ENROLL' })).toBe('ENROLLMENT');
  });

  it('provides the presenter the screen needs', () => {
    const { deps } = compositionFor();

    expect(
      deps.enrollmentPresenter.present({
        secret: 'ABCDEFGH',
        provisioningUri: 'otpauth://x',
      }).secret,
    ).toBe('ABCD EFGH');
  });

  it('provides the recovery codes presenter the screen needs', () => {
    const { deps } = compositionFor();

    expect(
      deps.recoveryCodesPresenter.present({
        enrolled: true,
        recoveryCodes: ['ABCDE23456'],
      }).codes,
    ).toEqual(['ABCDE-23456']);
  });

  it('provides the error presenter the screen needs', () => {
    const { deps } = compositionFor();

    expect(
      deps.errorPresenter.present(new Error(ErrorCode.SECOND_FACTOR_REQUIRED)),
    ).toBe(i18n.messages.errors.SECOND_FACTOR_REQUIRED);
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    const { deps, http } = compositionFor(null, null);

    await expect(deps.controller.beginEnrollment()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });
});
