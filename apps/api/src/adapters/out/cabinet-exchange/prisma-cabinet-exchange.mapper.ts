import {
  CabinetExchange,
  ExchangeCategory,
  ExchangeDirection,
  ExchangeEvent,
  ExchangeEventKind,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';

export type CabinetExchangeRow = {
  id: string;
  companyId: string;
  direction: ExchangeDirection;
  senderId: string;
  createdAt: Date;
  category: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  status: ExchangeStatus;
};

export type CabinetExchangeEventRow = {
  position: number;
  kind: ExchangeEventKind;
  actorId: string | null;
  occurredAt: Date;
  documentCount: number;
};

export function toCabinetExchangeData(exchange: CabinetExchange): {
  row: CabinetExchangeRow;
  events: CabinetExchangeEventRow[];
} {
  return {
    row: {
      id: exchange.id,
      companyId: exchange.companyId,
      direction: exchange.direction,
      senderId: exchange.senderId,
      createdAt: exchange.createdAt,
      category: exchange.category?.value ?? null,
      fileName: exchange.document?.fileName ?? null,
      mimeType: exchange.document?.mimeType ?? null,
      fileSize: exchange.document?.size ?? null,
      status: exchange.status,
    },
    events: exchange.history.map((event, position) => ({
      position,
      kind: event.kind,
      actorId: event.actorId,
      occurredAt: event.occurredAt,
      documentCount: event.documentCount,
    })),
  };
}

export function toCabinetExchange(
  row: CabinetExchangeRow & { events: readonly CabinetExchangeEventRow[] },
): CabinetExchange {
  return new CabinetExchange(
    row.id,
    row.companyId,
    row.direction,
    row.senderId,
    row.createdAt,
    row.category === null ? null : ExchangeCategory.parse(row.category),
    toDocument(row),
    row.status,
    [...row.events]
      .sort((left, right) => left.position - right.position)
      .map(toEvent),
  );
}

function toDocument(row: CabinetExchangeRow): CabinetExchange['document'] {
  if (row.fileName === null || row.mimeType === null || row.fileSize === null) {
    return null;
  }
  return {
    fileName: row.fileName,
    mimeType: row.mimeType,
    size: row.fileSize,
  };
}

function toEvent(row: CabinetExchangeEventRow): ExchangeEvent {
  return {
    kind: row.kind,
    actorId: row.actorId,
    occurredAt: row.occurredAt,
    documentCount: row.documentCount,
  };
}
