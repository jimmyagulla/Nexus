import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile, ExchangeFileInput } from '../value-objects/exchange-file';

export type ExchangeCompletion = {
  category?: string | null;
  file?: ExchangeFileInput | null;
};

export function completeExchange(
  exchange: CabinetExchange,
  completion: ExchangeCompletion,
): { exchange: CabinetExchange; file: ExchangeFile | null } {
  const category = parseCategory(completion.category);
  const file = parseFile(completion.file);
  const categorised =
    category === null ? exchange : exchange.withCategory(category);
  return {
    exchange: file === null ? categorised : categorised.withDocument(file),
    file,
  };
}

function parseCategory(raw: string | null | undefined): ExchangeCategory | null {
  return raw === undefined || raw === null ? null : ExchangeCategory.parse(raw);
}

function parseFile(
  raw: ExchangeFileInput | null | undefined,
): ExchangeFile | null {
  return raw === undefined || raw === null
    ? null
    : ExchangeFile.of(raw.fileName, raw.mimeType, raw.content);
}
