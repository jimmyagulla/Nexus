import {
  ActorContext,
  Company,
  CompanyName,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { SessionRecord } from '@hexagonal-monorepo-template/ports';

export const LOCAL_DEV_COMPANY_ID = 'local-dev-company';
export const LOCAL_DEV_USER_ID = 'local-dev-user';

export const localDevActor: ActorContext = {
  userId: LOCAL_DEV_USER_ID,
  companyId: LOCAL_DEV_COMPANY_ID,
  role: UserRole.EMPLOYER,
};

export const localDevSession: SessionRecord = {
  accessToken: 'local-dev',
  userId: LOCAL_DEV_USER_ID,
  appMetadata: {
    company_id: LOCAL_DEV_COMPANY_ID,
    role: UserRole.EMPLOYER,
  },
};

export function localDevCompany(): Company {
  return Company.create(
    LOCAL_DEV_COMPANY_ID,
    CompanyName.parse('Entreprise locale'),
  );
}
