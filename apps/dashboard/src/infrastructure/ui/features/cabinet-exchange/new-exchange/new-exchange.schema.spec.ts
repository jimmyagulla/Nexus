import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { newExchangeSchema } from './new-exchange.schema';

function filesOf(...files: File[]): FileList {
  return Object.assign([...files], {
    item: (index: number) => files[index] ?? null,
  }) as unknown as FileList;
}

const pdf = new File(['x'], 'releve.pdf', { type: 'application/pdf' });

describe('newExchangeSchema', () => {
  it('accepts a category and a PDF file', () => {
    const result = newExchangeSchema.safeParse({
      category: 'Facture',
      file: filesOf(pdf),
    });

    expect(result.success).toBe(true);
  });

  it('accepts JPEG and PNG files', () => {
    for (const type of ['image/jpeg', 'image/png']) {
      const image = new File(['x'], 'scan', { type });

      expect(
        newExchangeSchema.safeParse({ category: 'Facture', file: filesOf(image) })
          .success,
      ).toBe(true);
    }
  });

  it('refuses a blank category', () => {
    const result = newExchangeSchema.safeParse({
      category: '  ',
      file: filesOf(pdf),
    });

    expect(result.error?.issues[0]?.message).toBe(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('asks for a document when no file is chosen', () => {
    const result = newExchangeSchema.safeParse({
      category: 'Facture',
      file: filesOf(),
    });

    expect(result.error?.issues[0]?.message).toBe(ErrorCode.MISSING_DOCUMENT);
  });

  it('refuses a format outside PDF, JPEG and PNG', () => {
    const text = new File(['x'], 'notes.txt', { type: 'text/plain' });

    const result = newExchangeSchema.safeParse({
      category: 'Facture',
      file: filesOf(text),
    });

    expect(result.error?.issues[0]?.message).toBe(ErrorCode.INVALID_FILE);
  });

  it('refuses an empty file', () => {
    const empty = new File([], 'vide.pdf', { type: 'application/pdf' });

    const result = newExchangeSchema.safeParse({
      category: 'Facture',
      file: filesOf(empty),
    });

    expect(result.error?.issues[0]?.message).toBe(ErrorCode.INVALID_FILE);
  });
});
