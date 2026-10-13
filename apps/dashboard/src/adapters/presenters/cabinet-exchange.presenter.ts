import {
  CabinetExchangeSnapshot,
  canTransition,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../infrastructure/ui/i18n/i18n';

const OPENABLE: readonly ExchangeStatus[] = [
  ExchangeStatus.RECEIVED,
  ExchangeStatus.CONSULTED,
];

export interface CabinetExchangeViewModel {
  id: string;
  category: string;
  fileName: string;
  direction: string;
  status: string;
  date: string;
  consultedOn: string | null;
  canMarkToTransmit: boolean;
  canTransmit: boolean;
  canOpen: boolean;
}

export class CabinetExchangePresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(
    snapshots: readonly CabinetExchangeSnapshot[],
  ): CabinetExchangeViewModel[] {
    return snapshots.map((snapshot) => this.presentOne(snapshot));
  }

  private presentOne(snapshot: CabinetExchangeSnapshot): CabinetExchangeViewModel {
    const messages = this.i18n.messages.cabinet;
    return {
      id: snapshot.id,
      category: snapshot.category ?? messages.noCategory,
      fileName: snapshot.document?.fileName ?? messages.noFile,
      direction: messages.directions[snapshot.direction],
      status: messages.statuses[snapshot.status],
      date: this.formatDate(snapshot.date),
      consultedOn:
        snapshot.consultedAt === null ? null : this.formatDate(snapshot.consultedAt),
      canMarkToTransmit: canTransition(
        snapshot.status,
        ExchangeStatus.TO_TRANSMIT,
      ),
      canTransmit: canTransition(snapshot.status, ExchangeStatus.TRANSMITTED),
      canOpen: OPENABLE.includes(snapshot.status),
    };
  }

  private formatDate(isoInstant: string): string {
    const [year, month, day] = isoInstant.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
  }
}
