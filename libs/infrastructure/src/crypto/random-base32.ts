import { encodeBase32 } from '../totp/base32';

export function randomBase32(length: number): string {
  const bytes = globalThis.crypto.getRandomValues(
    new Uint8Array(Math.ceil((length * 5) / 8)),
  );
  return encodeBase32(bytes).slice(0, length);
}
