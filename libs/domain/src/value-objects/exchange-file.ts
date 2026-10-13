import { ErrorCode } from '../errors/error-code';

export const EXCHANGE_FILE_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export type ExchangeFileInput = {
  fileName: string;
  mimeType: string;
  content: Uint8Array;
};

export type ExchangeDocument = {
  fileName: string;
  mimeType: string;
  size: number;
};

export class ExchangeFile {
  private constructor(
    readonly fileName: string,
    readonly mimeType: string,
    readonly content: Uint8Array,
  ) {}

  static of(
    fileName: string,
    mimeType: string,
    content: Uint8Array,
  ): ExchangeFile {
    const name = fileName.trim();
    const accepted = (EXCHANGE_FILE_MIME_TYPES as readonly string[]).includes(
      mimeType,
    );
    if (name === '' || !accepted || content.length === 0) {
      throw new Error(ErrorCode.INVALID_FILE);
    }
    return new ExchangeFile(name, mimeType, Uint8Array.from(content));
  }

  describe(): ExchangeDocument {
    return {
      fileName: this.fileName,
      mimeType: this.mimeType,
      size: this.content.length,
    };
  }
}
