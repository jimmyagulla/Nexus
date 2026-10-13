import { describe, expect, it } from 'vitest';
import { ErrorCode, SecondFactorStep } from '@hexagonal-monorepo-template/domain';
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
    { execute: async () => ({ step: SecondFactorStep.VERIFY }) },
    {
      execute: async (code) => {
        if (code !== '123456') {
          throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
        }
        return { verified: true };
      },
    },
    { execute: async () => ({ step: SecondFactorStep.ENROLL }) },
  );
}

describe('SecondFactorController', () => {
  it('hands back the step the current session still owes', async () => {
    await expect(controller().getStatus()).resolves.toEqual({
      step: SecondFactorStep.ENROLL,
    });
  });

  it('hands back the challenge opened for the current session', async () => {
    await expect(controller().openChallenge()).resolves.toEqual({
      step: SecondFactorStep.VERIFY,
    });
  });

  it('hands back the enrollment of the current session', async () => {
    await expect(controller().beginEnrollment()).resolves.toEqual(enrollment);
  });

  it('hands back the confirmation of a valid code', async () => {
    await expect(controller().confirmEnrollment('123456')).resolves.toEqual({
      enrolled: true,
      recoveryCodes: ['ABCDE23456'],
    });
  });

  it('lets the refusal of an invalid enrollment code through', async () => {
    await expect(controller().confirmEnrollment('000000')).rejects.toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
  });

  it('hands back the verification of a valid code', async () => {
    await expect(controller().verify('123456')).resolves.toEqual({
      verified: true,
    });
  });

  it('lets the refusal of an invalid verification code through', async () => {
    await expect(controller().verify('000000')).rejects.toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
  });
});
