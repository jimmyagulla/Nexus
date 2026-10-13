import { SecondFactorEnrollment } from '@hexagonal-monorepo-template/domain';

export interface SecondFactorEnrollmentViewModel {
  secret: string;
  provisioningUri: string;
}

export class SecondFactorEnrollmentPresenter {
  present(enrollment: SecondFactorEnrollment): SecondFactorEnrollmentViewModel {
    return {
      secret: this.groupByFour(enrollment.secret),
      provisioningUri: enrollment.provisioningUri,
    };
  }

  private groupByFour(secret: string): string {
    return (secret.match(/.{1,4}/g) ?? []).join(' ');
  }
}
