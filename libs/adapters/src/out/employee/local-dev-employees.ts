import { EmployeeReference } from '@hexagonal-monorepo-template/domain';
import { LOCAL_DEV_COMPANY_ID } from '../session/local-dev-session';

export function localDevEmployees(): readonly EmployeeReference[] {
  return [
    {
      id: 'local-dev-employee-camille',
      companyId: LOCAL_DEV_COMPANY_ID,
      fullName: 'Camille Martin',
    },
    {
      id: 'local-dev-employee-dominique',
      companyId: LOCAL_DEV_COMPANY_ID,
      fullName: 'Dominique Durand',
    },
  ];
}
