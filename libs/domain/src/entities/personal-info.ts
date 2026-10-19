import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { CalendarDate } from '../value-objects/calendar-date';
import {
  EmploymentContractType,
  WorkingTime,
} from '../value-objects/employment-contract';
import { PersonalContact } from '../value-objects/personal-contact';

/** What the employer records about the employee; the employee only reads it. */
export type EmploymentRecord = {
  lastName: string;
  firstName: string;
  birthDate: CalendarDate;
  socialSecurityNumber: string;
  jobTitle: string;
  department: string;
  contractType: EmploymentContractType;
  workingTime: WorkingTime;
  startDate: CalendarDate;
  iban: string;
};

export type PersonalInfoProps = {
  companyId: string;
  /** The employee these information describe. */
  employeeId: string;
  contact: PersonalContact;
  employment: EmploymentRecord;
  /** Last change of any of these information. */
  updatedAt: Date;
};

/** The personal information of one employee of one company. */
export class PersonalInfo {
  constructor(private readonly props: PersonalInfoProps) {}

  get companyId(): string {
    return this.props.companyId;
  }

  get employeeId(): string {
    return this.props.employeeId;
  }

  get contact(): PersonalContact {
    return this.props.contact;
  }

  get employment(): EmploymentRecord {
    return this.props.employment;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /** The employee themselves, or an employer of their company. */
  isReadableBy(actor: ActorContext): boolean {
    return (
      this.props.companyId === actor.companyId &&
      (this.isOwnedBy(actor) || actor.role === UserRole.EMPLOYER)
    );
  }

  /** Only the employee themselves keeps their contact details up to date. */
  isEditableBy(actor: ActorContext): boolean {
    return this.props.companyId === actor.companyId && this.isOwnedBy(actor);
  }

  /** The same information with new contact details, changed at `at`. */
  withContact(contact: PersonalContact, at: Date): PersonalInfo {
    return new PersonalInfo({ ...this.props, contact, updatedAt: at });
  }

  private isOwnedBy(actor: ActorContext): boolean {
    return this.props.employeeId === actor.userId;
  }
}
