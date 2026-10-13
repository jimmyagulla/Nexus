import { describe, expect, it } from 'vitest';
import { SecondFactorStep } from '@hexagonal-monorepo-template/domain';
import { SecondFactorStepPresenter } from './second-factor-step.presenter';

describe('SecondFactorStepPresenter', () => {
  it('leads an employee who is not enrolled to the enrollment', () => {
    expect(
      new SecondFactorStepPresenter().present({ step: SecondFactorStep.ENROLL }),
    ).toBe('ENROLLMENT');
  });

  it('leads an enrolled employee to the verification', () => {
    expect(
      new SecondFactorStepPresenter().present({ step: SecondFactorStep.VERIFY }),
    ).toBe('VERIFICATION');
  });

  it('leads whoever owes no second factor to the space', () => {
    expect(
      new SecondFactorStepPresenter().present({ step: SecondFactorStep.NONE }),
    ).toBe('SPACE');
  });
});
