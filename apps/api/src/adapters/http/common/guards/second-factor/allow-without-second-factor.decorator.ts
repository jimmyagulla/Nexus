import { SetMetadata } from '@nestjs/common';

export const ALLOW_WITHOUT_SECOND_FACTOR = 'allowWithoutSecondFactor';

export const AllowWithoutSecondFactor = () =>
  SetMetadata(ALLOW_WITHOUT_SECOND_FACTOR, true);
