import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { receiptSchema } from './receipt.schema';

function messagesFor(file: unknown): string[] {
  const result = receiptSchema.safeParse({ file });
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe('receiptSchema', () => {
  it.each(['application/pdf', 'image/jpeg', 'image/png'])(
    'accepts a %s file',
    (type) => {
      const file = new File(['content'], 'ticket', { type });

      expect(receiptSchema.parse({ file }).file).toBe(file);
    },
  );

  it('asks for the expected document when no file is chosen', () => {
    expect(messagesFor(undefined)).toEqual([ErrorCode.MISSING_DOCUMENT]);
  });

  it('refuses a file of another format', () => {
    expect(
      messagesFor(new File(['content'], 'notes.txt', { type: 'text/plain' })),
    ).toEqual([ErrorCode.INVALID_FILE]);
  });

  it('refuses an empty file', () => {
    expect(
      messagesFor(new File([], 'ticket.pdf', { type: 'application/pdf' })),
    ).toEqual([ErrorCode.INVALID_FILE]);
  });
});
