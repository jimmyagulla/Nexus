import { PersonalInfoSnapshot } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

export interface EmployerInfoModel {
  id: string;
  label: string;
  value: string;
}

type Employment = PersonalInfoSnapshot['employment'];

/** Presents the rows of the read-only card of what the employer records. */
export class EmployerInfoPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(employment: Employment): EmployerInfoModel[] {
    const labels = this.i18n.messages.personalInfo.employment;
    return [
      { id: 'last-name', label: labels.lastName, value: employment.lastName },
      { id: 'first-name', label: labels.firstName, value: employment.firstName },
      { id: 'birth-date', label: labels.birthDate, value: this.presentDay(employment.birthDate) },
      { id: 'ssn', label: labels.socialSecurityNumber, value: employment.socialSecurityNumber },
      { id: 'job', label: labels.jobTitle, value: employment.jobTitle },
      { id: 'department', label: labels.department, value: employment.department },
      { id: 'contract', label: labels.contract, value: this.presentContract(employment) },
      { id: 'start-date', label: labels.startDate, value: this.presentDay(employment.startDate) },
      { id: 'bank', label: labels.iban, value: employment.iban },
    ];
  }

  /** "CDI — temps plein" */
  private presentContract(employment: Employment): string {
    const labels = this.i18n.messages.personalInfo.employment;
    return labels.contractValue
      .replace('{contract}', labels.contractTypes[employment.contractType])
      .replace('{workingTime}', labels.workingTimes[employment.workingTime]);
  }

  /** A calendar day `YYYY-MM-DD` as `jj/mm/aaaa`, whatever the time zone. */
  private presentDay(day: string): string {
    const [year, month, date] = day.split('-');
    return `${date}/${month}/${year}`;
  }
}
