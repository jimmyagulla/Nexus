import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiSecondFactorGateway } from './api-second-factor.gateway';

const enrollment = { secret: 'SECRET', provisioningUri: 'otpauth://totp/x' };

describe('ApiSecondFactorGateway', () => {
  it('begins the enrollment and reads it from the envelope', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'second-factor/enrollment', {
      status: 201,
      data: enrollment,
    });

    await expect(
      new ApiSecondFactorGateway(http).beginEnrollment('token'),
    ).resolves.toEqual(enrollment);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'second-factor/enrollment',
        data: undefined,
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('confirms the enrollment with the code', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'second-factor/enrollment/confirmation', {
      status: 201,
      data: { enrolled: true, recoveryCodes: ['ABCDE23456', 'FGHIJ23456'] },
    });

    await expect(
      new ApiSecondFactorGateway(http).confirmEnrollment('123456', 'token'),
    ).resolves.toEqual({
      enrolled: true,
      recoveryCodes: ['ABCDE23456', 'FGHIJ23456'],
    });
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'second-factor/enrollment/confirmation',
        data: { code: '123456' },
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('reads the status of the signed-in user without opening anything', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'second-factor/status', {
      status: 200,
      data: { step: 'ENROLL' },
    });

    await expect(
      new ApiSecondFactorGateway(http).getStatus('token'),
    ).resolves.toEqual({ step: 'ENROLL' });
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'second-factor/status',
        data: undefined,
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('opens the challenge of the signed-in user', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'second-factor/challenge', {
      status: 201,
      data: { step: 'VERIFY' },
    });

    await expect(
      new ApiSecondFactorGateway(http).openChallenge('token'),
    ).resolves.toEqual({ step: 'VERIFY' });
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'second-factor/challenge',
        data: undefined,
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });

  it('verifies the second factor with a code', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'second-factor/verification', {
      status: 201,
      data: { verified: true },
    });

    await expect(
      new ApiSecondFactorGateway(http).verify('ABCDE-23456', 'token'),
    ).resolves.toEqual({ verified: true });
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'second-factor/verification',
        data: { code: 'ABCDE-23456' },
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });
});
