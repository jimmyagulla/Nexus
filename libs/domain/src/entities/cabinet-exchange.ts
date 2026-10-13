import { ErrorCode } from '../errors/error-code';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeDocument, ExchangeFile } from '../value-objects/exchange-file';
import { ExchangeDirection } from './exchange-direction';
import { ExchangeEvent, ExchangeEventKind } from './exchange-event';
import { ExchangeStatus } from './exchange-status';

export class CabinetExchange {
  constructor(
    readonly id: string,
    readonly companyId: string,
    readonly direction: ExchangeDirection,
    readonly senderId: string,
    readonly createdAt: Date,
    readonly category: ExchangeCategory | null,
    readonly document: ExchangeDocument | null,
    readonly status: ExchangeStatus,
    readonly history: readonly ExchangeEvent[],
  ) {}

  static draft(
    id: string,
    companyId: string,
    senderId: string,
    createdAt: Date,
  ): CabinetExchange {
    return new CabinetExchange(
      id,
      companyId,
      ExchangeDirection.COMPANY_TO_CABINET,
      senderId,
      createdAt,
      null,
      null,
      ExchangeStatus.DRAFT,
      [],
    );
  }

  withCategory(category: ExchangeCategory): CabinetExchange {
    return this.copy({ category });
  }

  withDocument(file: ExchangeFile): CabinetExchange {
    return this.copy({ document: file.describe() });
  }

  markToTransmit(): CabinetExchange {
    if (this.document === null) {
      throw new Error(ErrorCode.MISSING_DOCUMENT);
    }
    if (this.category === null) {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return this.copy({ status: ExchangeStatus.TO_TRANSMIT });
  }

  transmit(
    actorId: string,
    occurredAt: Date,
    documentCount = 1,
  ): CabinetExchange {
    return this.copy({
      status: ExchangeStatus.TRANSMITTED,
      history: [
        ...this.history,
        {
          kind: ExchangeEventKind.TRANSMITTED,
          actorId,
          occurredAt,
          documentCount,
        },
      ],
    });
  }

  receive(occurredAt: Date): CabinetExchange {
    return this.copy({
      status: ExchangeStatus.RECEIVED,
      history: [
        ...this.history,
        {
          kind: ExchangeEventKind.RECEIVED,
          actorId: null,
          occurredAt,
          documentCount: 1,
        },
      ],
    });
  }

  private copy(
    changes: Partial<{
      category: ExchangeCategory | null;
      document: ExchangeDocument | null;
      status: ExchangeStatus;
      history: readonly ExchangeEvent[];
    }>,
  ): CabinetExchange {
    return new CabinetExchange(
      this.id,
      this.companyId,
      this.direction,
      this.senderId,
      this.createdAt,
      changes.category === undefined ? this.category : changes.category,
      changes.document === undefined ? this.document : changes.document,
      changes.status ?? this.status,
      changes.history ?? this.history,
    );
  }
}
