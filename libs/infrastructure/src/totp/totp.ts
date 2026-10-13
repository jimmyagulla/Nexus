import { decodeBase32, encodeBase32 } from './base32';

const STEP_SECONDS = 30;
const DIGITS = 6;
const SECRET_BYTES = 20;
const ACCEPTED_STEPS_AROUND = 1;

export function generateTotpSecret(): string {
  return encodeBase32(globalThis.crypto.getRandomValues(new Uint8Array(SECRET_BYTES)));
}

export async function computeTotp(
  secret: string,
  atMs: number,
  step = Math.floor(atMs / 1000 / STEP_SECONDS),
): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    decodeBase32(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  );
  const counter = new Uint8Array(8);
  new DataView(counter.buffer).setBigUint64(0, BigInt(step));
  const digest = new Uint8Array(
    await globalThis.crypto.subtle.sign('HMAC', key, counter),
  );
  const offset = (digest[digest.length - 1] ?? 0) & 15;
  const binary =
    (((digest[offset] ?? 0) & 127) << 24) |
    (((digest[offset + 1] ?? 0) & 255) << 16) |
    (((digest[offset + 2] ?? 0) & 255) << 8) |
    ((digest[offset + 3] ?? 0) & 255);
  return String(binary % 10 ** DIGITS).padStart(DIGITS, '0');
}

export async function verifyTotp(
  secret: string,
  code: string,
  atMs: number,
): Promise<boolean> {
  const current = Math.floor(atMs / 1000 / STEP_SECONDS);
  for (let shift = -ACCEPTED_STEPS_AROUND; shift <= ACCEPTED_STEPS_AROUND; shift += 1) {
    if ((await computeTotp(secret, atMs, current + shift)) === code) {
      return true;
    }
  }
  return false;
}
