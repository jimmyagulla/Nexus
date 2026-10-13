import { ExchangeFile } from '@hexagonal-monorepo-template/domain';
import { IExchangeFileStorage } from '@hexagonal-monorepo-template/ports';

export class InMemoryExchangeFileStorage implements IExchangeFileStorage {
  constructor(private readonly files = new Map<string, ExchangeFile>()) {}

  async save(exchangeId: string, file: ExchangeFile): Promise<void> {
    this.files.set(
      exchangeId,
      ExchangeFile.of(file.fileName, file.mimeType, file.content),
    );
  }

  async find(exchangeId: string): Promise<ExchangeFile | null> {
    return this.files.get(exchangeId) ?? null;
  }
}
