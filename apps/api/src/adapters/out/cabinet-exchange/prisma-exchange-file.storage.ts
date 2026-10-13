import { ExchangeFile } from '@hexagonal-monorepo-template/domain';
import { IExchangeFileStorage } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';

export class PrismaExchangeFileStorage implements IExchangeFileStorage {
  constructor(private readonly prisma: PrismaDb) {}

  async save(exchangeId: string, file: ExchangeFile): Promise<void> {
    const stored = {
      fileName: file.fileName,
      mimeType: file.mimeType,
      content: Uint8Array.from(file.content),
    };
    await this.prisma.cabinetExchangeFile.upsert({
      where: { exchangeId },
      create: { exchangeId, ...stored },
      update: stored,
    });
  }

  async find(exchangeId: string): Promise<ExchangeFile | null> {
    const row = await this.prisma.cabinetExchangeFile.findUnique({
      where: { exchangeId },
    });
    return row === null
      ? null
      : ExchangeFile.of(row.fileName, row.mimeType, row.content);
  }
}
