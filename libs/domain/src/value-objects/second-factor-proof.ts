import { ErrorCode } from '../errors/error-code';
import { RecoveryCode } from './recovery-code';
import { SecondFactorCode } from './second-factor-code';

export type SecondFactorProofKind = 'CODE' | 'RECOVERY_CODE';

export class SecondFactorProof {
  private constructor(
    readonly kind: SecondFactorProofKind,
    readonly value: string,
  ) {}

  static parse(raw: string): SecondFactorProof {
    if (raw.trim() === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    const code = SecondFactorProof.tryParse(() => SecondFactorCode.parse(raw));
    if (code !== null) {
      return new SecondFactorProof('CODE', code.value);
    }
    const recovery = SecondFactorProof.tryParse(() => RecoveryCode.parse(raw));
    if (recovery !== null) {
      return new SecondFactorProof('RECOVERY_CODE', recovery.value);
    }
    throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
  }

  private static tryParse<T>(parse: () => T): T | null {
    try {
      return parse();
    } catch {
      return null;
    }
  }
}
