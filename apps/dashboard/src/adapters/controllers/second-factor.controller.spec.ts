import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { SecondFactorController } from './second-factor.controller';

const enrollment = { secret: 'SECRET', provisioningUri: 'otpauth://x' };

function controller(): SecondFactorController {
  return new SecondFactorController(
    { execute: async () => enrollment },
    {
      execute: async (code) => {
        if (code !== '123456') {
          throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
        }
        return { enrolled: true, recoveryCodes: ['ABCDE23456'] };
      },
    },
  );
}

describe('SecondFactorController', () => {
  it('hands back the enrollment of the current session', async () => {
    await expect(controller().beginEnrollment()).resolves.toEqual(enrollment);
  });

  it('hands back the confirmation of a valid code', async () => {
    await expect(controller().confirmEnrollment('123456')).resolves.toEqual({
      enrolled: true,
      recoveryCodes: ['ABCDE23456'],
    });
  });

  it('lets the refusal of an invalid code through', async () => {
    await expect(controller().confirmEnrollment('000000')).rejects.toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
  });
});
