import { ISecondFactorCodes } from '@hexagonal-monorepo-template/ports';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const SECRET_BYTES = 20;
const ISSUER = 'Nexus';

export class TotpSecondFactorCodes implements ISecondFactorCodes {
  issueSecret(): string {
    const bytes = globalThis.crypto.getRandomValues(
      new Uint8Array(SECRET_BYTES),
    );
    return this.toBase32(bytes);
  }

  provisioningUri(label: string, secret: string): string {
    const account = encodeURIComponent(label);
    return `otpauth://totp/${ISSUER}:${account}?secret=${secret}&issuer=${ISSUER}`;
  }

  private toBase32(bytes: Uint8Array): string {
    let bits = 0;
    let value = 0;
    let output = '';
    for (const byte of bytes) {
      value = (value << 8) | byte;
      bits += 8;
      while (bits >= 5) {
        output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    return output;
  }
}
