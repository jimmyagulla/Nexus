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
      data: { enrolled: true },
    });

    await expect(
      new ApiSecondFactorGateway(http).confirmEnrollment('123456', 'token'),
    ).resolves.toEqual({ enrolled: true });
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'second-factor/enrollment/confirmation',
        data: { code: '123456' },
        config: { headers: { Authorization: 'Bearer token' } },
      },
    ]);
  });
});
