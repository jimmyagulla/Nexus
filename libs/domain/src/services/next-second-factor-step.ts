import { UserRole } from '../identity/user-role';
import { requiresSecondFactor } from './requires-second-factor';

export const SecondFactorStep = {
  ENROLL: 'ENROLL',
  VERIFY: 'VERIFY',
  NONE: 'NONE',
} as const;

export type SecondFactorStep =
  (typeof SecondFactorStep)[keyof typeof SecondFactorStep];

export function nextSecondFactorStep(input: {
  role: UserRole | null;
  enrolled: boolean;
  verified: boolean;
}): SecondFactorStep {
  if (!requiresSecondFactor(input.role) || input.verified) {
    return SecondFactorStep.NONE;
  }
  return input.enrolled ? SecondFactorStep.VERIFY : SecondFactorStep.ENROLL;
}
