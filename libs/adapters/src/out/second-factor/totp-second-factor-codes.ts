import { ISecondFactorCodes } from '@hexagonal-monorepo-template/ports';
import {
  generateTotpSecret,
  verifyTotp,
} from '@hexagonal-monorepo-template/infrastructure';

export class TotpSecondFactorCodes implements ISecondFactorCodes {
  generateSecret(): string {
    return generateTotpSecret();
  }

  matches(secret: string, code: string, at: Date): Promise<boolean> {
    return verifyTotp(secret, code, at.getTime());
  }
}
