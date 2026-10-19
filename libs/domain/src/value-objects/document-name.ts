import { requireText, requireValid } from '../services/text-rules';
import { DOCUMENT_NAME_MAX_LENGTH } from './document-limits';

export class DocumentName {
  private constructor(readonly value: string) {}

  static parse(raw: string): DocumentName {
    const value = requireText(raw);
    return new DocumentName(requireValid(value, value.length <= DOCUMENT_NAME_MAX_LENGTH));
  }

  /**
   * Name proposed for a file: the file name, cut to the longest name a
   * document may carry.
   */
  static proposedFor(fileName: string): string {
    return fileName.trim().slice(0, DOCUMENT_NAME_MAX_LENGTH);
  }
}
