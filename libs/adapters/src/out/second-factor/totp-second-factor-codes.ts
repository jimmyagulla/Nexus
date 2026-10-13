import { SECOND_FACTOR_CODE_PATTERN } from '@hexagonal-monorepo-template/domain';
import { ISecondFactorCodes } from '@hexagonal-monorepo-template/ports';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const SECRET_BYTES = 20;
const ISSUER = 'Nexus';
const PERIOD_SECONDS = 30;
const DIGITS = 6;
const DRIFT_PERIODS = 1;

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

  async verify(secret: string, code: string, at: Date): Promise<boolean> {
    const candidate = code.trim();
    const key = this.fromBase32(secret);
    if (key === null || !SECOND_FACTOR_CODE_PATTERN.test(candidate)) {
      return false;
    }
    const current = Math.floor(at.getTime() / 1000 / PERIOD_SECONDS);
    for (let drift = -DRIFT_PERIODS; drift <= DRIFT_PERIODS; drift += 1) {
      if ((await this.codeFor(key, current + drift)) === candidate) {
        return true;
      }
    }
    return false;
  }

  private async codeFor(key: Uint8Array, counter: number): Promise<string> {
    const digest = await this.hmacSha1(key, this.counterBytes(counter));
    const offset = (digest[digest.length - 1] ?? 0) & 0x0f;
    const binary =
      (((digest[offset] ?? 0) & 0x7f) << 24) |
      (((digest[offset + 1] ?? 0) & 0xff) << 16) |
      (((digest[offset + 2] ?? 0) & 0xff) << 8) |
      ((digest[offset + 3] ?? 0) & 0xff);
    return String(binary % 10 ** DIGITS).padStart(DIGITS, '0');
  }

  private async hmacSha1(
    key: Uint8Array,
    message: Uint8Array,
  ): Promise<Uint8Array> {
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      'raw',
      key as BufferSource,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign'],
    );
    const signature = await globalThis.crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      message as BufferSource,
    );
    return new Uint8Array(signature);
  }

  private counterBytes(counter: number): Uint8Array {
    const bytes = new Uint8Array(8);
    let remaining = counter;
    for (let index = 7; index >= 0; index -= 1) {
      bytes[index] = remaining % 256;
      remaining = Math.floor(remaining / 256);
    }
    return bytes;
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

  private fromBase32(secret: string): Uint8Array | null {
    const bytes: number[] = [];
    let bits = 0;
    let value = 0;
    for (const char of secret.trim().toUpperCase()) {
      const index = BASE32_ALPHABET.indexOf(char);
      if (index === -1) {
        return null;
      }
      value = (value << 5) | index;
      bits += 5;
      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 0xff);
        bits -= 8;
      }
    }
    return bytes.length === 0 ? null : new Uint8Array(bytes);
  }
}
