import { SetMetadata } from '@nestjs/common';

export const ALLOW_WITHOUT_COMPANY = 'allowWithoutCompany';

export const AllowWithoutCompany = () =>
  SetMetadata(ALLOW_WITHOUT_COMPANY, true);
