import { PersonalInfo } from '../entities/personal-info';
import { maskIban, maskSocialSecurityNumber } from '../services/mask-sensitive-numbers';
import {
  EmploymentContractType,
  WorkingTime,
} from '../value-objects/employment-contract';
import { PersonalContactValues } from '../value-objects/personal-contact';

/**
 * The personal information of an employee, as they leave the API. The social
 * security number and the IBAN only travel masked.
 */
export type PersonalInfoSnapshot = {
  employeeId: string;
  contact: PersonalContactValues;
  employment: {
    lastName: string;
    firstName: string;
    /** `YYYY-MM-DD` */
    birthDate: string;
    /** Masked: `2 92 05 •• ••• ••• 41`. */
    socialSecurityNumber: string;
    jobTitle: string;
    department: string;
    contractType: EmploymentContractType;
    workingTime: WorkingTime;
    /** `YYYY-MM-DD` */
    startDate: string;
    /** Masked: `FR76 •••• •••• •••• •••• •••• 189`. */
    iban: string;
  };
  /** ISO 8601 instant of the last change. */
  updatedAt: string;
};

export function toPersonalInfoSnapshot(info: PersonalInfo): PersonalInfoSnapshot {
  const employment = info.employment;
  return {
    employeeId: info.employeeId,
    contact: info.contact.toValues(),
    employment: {
      lastName: employment.lastName,
      firstName: employment.firstName,
      birthDate: employment.birthDate.value,
      socialSecurityNumber: maskSocialSecurityNumber(employment.socialSecurityNumber),
      jobTitle: employment.jobTitle,
      department: employment.department,
      contractType: employment.contractType,
      workingTime: employment.workingTime,
      startDate: employment.startDate.value,
      iban: maskIban(employment.iban),
    },
    updatedAt: info.updatedAt.toISOString(),
  };
}
