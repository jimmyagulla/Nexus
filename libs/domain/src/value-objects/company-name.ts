import { requireText } from '../services/text-rules';

export class CompanyName {
  private constructor(readonly value: string) {}

  static parse(raw: string): CompanyName {
    return new CompanyName(requireText(raw));
  }
}
