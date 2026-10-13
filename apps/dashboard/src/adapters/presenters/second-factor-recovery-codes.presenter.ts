import { SecondFactorEnrollmentConfirmation } from '@hexagonal-monorepo-template/domain';

export interface SecondFactorRecoveryCodesViewModel {
  codes: string[];
}

export class SecondFactorRecoveryCodesPresenter {
  present(
    confirmation: SecondFactorEnrollmentConfirmation,
  ): SecondFactorRecoveryCodesViewModel {
    return { codes: confirmation.recoveryCodes.map((code) => this.inHalves(code)) };
  }

  private inHalves(code: string): string {
    const middle = Math.ceil(code.length / 2);
    return `${code.slice(0, middle)}-${code.slice(middle)}`;
  }
}
