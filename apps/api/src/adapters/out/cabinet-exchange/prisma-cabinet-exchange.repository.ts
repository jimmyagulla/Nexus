import { CabinetExchange } from '@hexagonal-monorepo-template/domain';
import { ICabinetExchangeRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import {
  toCabinetExchange,
  toCabinetExchangeData,
} from './prisma-cabinet-exchange.mapper';

const WITH_EVENTS = { events: true } as const;

export class PrismaCabinetExchangeRepository
  implements ICabinetExchangeRepository
{
  constructor(private readonly prisma: PrismaDb) {}

  nextId(): string {
    return globalThis.crypto.randomUUID();
  }

  async save(exchange: CabinetExchange): Promise<void> {
    const { row, events } = toCabinetExchangeData(exchange);
    const { id, ...changes } = row;
    await this.prisma.cabinetExchange.upsert({
      where: { id },
      create: { ...row, events: { create: events } },
      update: { ...changes, events: { deleteMany: {}, create: events } },
    });
  }

  async findById(id: string): Promise<CabinetExchange | null> {
    const row = await this.prisma.cabinetExchange.findUnique({
      where: { id },
      include: WITH_EVENTS,
    });
    return row === null ? null : toCabinetExchange(row);
  }

  async listByCompany(companyId: string): Promise<readonly CabinetExchange[]> {
    const rows = await this.prisma.cabinetExchange.findMany({
      where: { companyId },
      include: WITH_EVENTS,
    });
    return rows.map(toCabinetExchange);
  }
}
