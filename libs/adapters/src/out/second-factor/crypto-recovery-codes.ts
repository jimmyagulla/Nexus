import { IRecoveryCodes } from '@hexagonal-monorepo-template/ports';
import {
  randomBase32,
  sha256Hex,
} from '@hexagonal-monorepo-template/infrastructure';

const RECOVERY_CODE_LENGTH = 10;

export class CryptoRecoveryCodes implements IRecoveryCodes {
  generate(count: number): readonly string[] {
    return Array.from({ length: count }, () =>
      randomBase32(RECOVERY_CODE_LENGTH),
    );
  }

  digest(code: string): Promise<string> {
    return sha256Hex(code);
  }
}
