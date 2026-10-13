import { ErrorCode } from '../errors/error-code';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeDocument, ExchangeFile } from '../value-objects/exchange-file';
import { ExchangeDirection } from './exchange-direction';
import { ExchangeEvent, ExchangeEventKind } from './exchange-event';
import { ExchangeStatus } from './exchange-status';
import { canTransition } from './exchange-status-transitions';

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

  static deposit(
    id: string,
    companyId: string,
    cabinetUserId: string,
    category: ExchangeCategory,
    file: ExchangeFile,
    occurredAt: Date,
  ): CabinetExchange {
    return new CabinetExchange(
      id,
      companyId,
      ExchangeDirection.CABINET_TO_COMPANY,
      cabinetUserId,
      occurredAt,
      category,
      file.describe(),
      ExchangeStatus.TRANSMITTED,
      [
        {
          kind: ExchangeEventKind.TRANSMITTED,
          actorId: cabinetUserId,
          occurredAt,
          documentCount: 1,
        },
      ],
    );
  }

  withCategory(category: ExchangeCategory): CabinetExchange {
    this.requireDraft();
    return this.copy({ category });
  }

  withDocument(file: ExchangeFile): CabinetExchange {
    this.requireDraft();
    return this.copy({ document: file.describe() });
  }

  markToTransmit(): CabinetExchange {
    this.requireTransitionTo(ExchangeStatus.TO_TRANSMIT);
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
    this.requireTransitionTo(ExchangeStatus.TRANSMITTED);
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
    this.requireTransitionTo(ExchangeStatus.RECEIVED);
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

  consult(actorId: string, occurredAt: Date): CabinetExchange {
    return this.open(ExchangeEventKind.CONSULTED, actorId, occurredAt);
  }

  download(actorId: string, occurredAt: Date): CabinetExchange {
    return this.open(ExchangeEventKind.DOWNLOADED, actorId, occurredAt);
  }

  /** The day an exchange is dated by: its transmission, else its creation. */
  date(): Date {
    return (
      this.history.find((event) => event.kind === ExchangeEventKind.TRANSMITTED)
        ?.occurredAt ?? this.createdAt
    );
  }

  firstConsultedAt(): Date | null {
    return (
      this.history.find((event) => event.kind === ExchangeEventKind.CONSULTED)
        ?.occurredAt ?? null
    );
  }

  private open(
    kind: ExchangeEventKind,
    actorId: string,
    occurredAt: Date,
  ): CabinetExchange {
    this.requireOpenable();
    return this.copy({
      status: ExchangeStatus.CONSULTED,
      history: [
        ...this.history,
        { kind, actorId, occurredAt, documentCount: 1 },
      ],
    });
  }

  private requireDraft(): void {
    if (this.status !== ExchangeStatus.DRAFT) {
      throw new Error(ErrorCode.REQUEST_ALREADY_PROCESSED);
    }
  }

  private requireTransitionTo(target: ExchangeStatus): void {
    if (!canTransition(this.status, target)) {
      throw new Error(ErrorCode.REQUEST_ALREADY_PROCESSED);
    }
  }

  /** A later opening leaves the exchange Consulted, it is not a transition. */
  private requireOpenable(): void {
    if (
      this.status !== ExchangeStatus.CONSULTED &&
      !canTransition(this.status, ExchangeStatus.CONSULTED)
    ) {
      throw new Error(ErrorCode.REQUEST_ALREADY_PROCESSED);
    }
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
