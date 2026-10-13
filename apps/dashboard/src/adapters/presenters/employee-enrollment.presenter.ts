import { SecondFactorEnrollmentOffer } from '@hexagonal-monorepo-template/domain';

const GROUP_SIZE = 4;

export type EmployeeEnrollmentViewModel = {
  secretDisplay: string;
  provisioningUri: string;
};

export class EmployeeEnrollmentPresenter {
  present(offer: SecondFactorEnrollmentOffer): EmployeeEnrollmentViewModel {
    return {
      secretDisplay: this.group(offer.secret),
      provisioningUri: offer.provisioningUri,
    };
  }

  private group(secret: string): string {
    const groups: string[] = [];
    for (let start = 0; start < secret.length; start += GROUP_SIZE) {
      groups.push(secret.slice(start, start + GROUP_SIZE));
    }
    return groups.join(' ');
  }
}
