import { ErrorCode } from '../errors/error-code';

export const RECEIPT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export type ReceiptDetailsInput = {
  fileName: string;
  mimeType: string;
  content: Uint8Array;
  expenseId: string | null;
};

export class ReceiptDetails {
  private constructor(
    readonly fileName: string,
    readonly mimeType: string,
    readonly content: Uint8Array,
    readonly expenseId: string | null,
  ) {}

  static parse(input: ReceiptDetailsInput): ReceiptDetails {
    const fileName = input.fileName.trim();
    if (
      fileName === '' ||
      input.content.length === 0 ||
      !ReceiptDetails.isAcceptedType(input.mimeType)
    ) {
      throw new Error(ErrorCode.INVALID_FILE);
    }
    return new ReceiptDetails(
      fileName,
      input.mimeType,
      input.content,
      input.expenseId,
    );
  }

  detachedFromExpense(): ReceiptDetails {
    return new ReceiptDetails(this.fileName, this.mimeType, this.content, null);
  }

  private static isAcceptedType(mimeType: string): boolean {
    return (RECEIPT_MIME_TYPES as readonly string[]).includes(mimeType);
  }
}
