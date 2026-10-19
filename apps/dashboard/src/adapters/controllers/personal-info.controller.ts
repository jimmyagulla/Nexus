import {
  PersonalContactValues,
  PersonalInfoSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IGetPersonalInfoFromSession,
  IUpdatePersonalContactFromSession,
} from '@hexagonal-monorepo-template/ports';

export class PersonalInfoController {
  constructor(
    private readonly getFromSession: IGetPersonalInfoFromSession,
    private readonly updateContactFromSession: IUpdatePersonalContactFromSession,
  ) {}

  /** The personal information of the signed-in employee. */
  loadPersonalInfo(): Promise<PersonalInfoSnapshot> {
    return this.getFromSession.execute();
  }

  /** Saves the contact details the employee confirmed. */
  updateContact(contact: PersonalContactValues): Promise<PersonalInfoSnapshot> {
    return this.updateContactFromSession.execute(contact);
  }
}
