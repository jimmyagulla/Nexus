import { ErrorCode } from '../errors/error-code';
import { DOCUMENT_NAME_MAX_LENGTH } from './document-limits';

export class DocumentName {
  private constructor(readonly value: string) {}

  static parse(raw: string): DocumentName {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    if (value.length > DOCUMENT_NAME_MAX_LENGTH) {
      throw new Error(ErrorCode.INVALID_INFORMATION);
    }
    return new DocumentName(value);
  }

  /**
   * Name proposed for a file: the file name, cut to the longest name a
   * document may carry.
   */
  static proposedFor(fileName: string): string {
    return fileName.trim().slice(0, DOCUMENT_NAME_MAX_LENGTH);
  }
}
