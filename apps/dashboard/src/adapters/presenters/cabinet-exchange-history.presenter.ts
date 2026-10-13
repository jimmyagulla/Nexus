import {
  ExchangeDirection,
  ExchangeEventKind,
  ExchangeHistoryEntry,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../infrastructure/ui/i18n/i18n';

export interface ExchangeHistoryEntryViewModel {
  key: string;
  who: string;
  phrase: string;
  when: string;
}

export class CabinetExchangeHistoryPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(
    entries: readonly ExchangeHistoryEntry[],
  ): ExchangeHistoryEntryViewModel[] {
    return entries.map((entry, index) => ({
      key: `${entry.exchangeId}-${entry.kind}-${entry.occurredAt}-${index}`,
      who: this.who(entry.actorRole),
      phrase: this.phrase(entry),
      when: this.formatInstant(entry.occurredAt),
    }));
  }

  private who(role: UserRole | null): string {
    const words = this.i18n.messages.cabinet.history;
    if (role === UserRole.EMPLOYER) {
      return words.whoEmployer;
    }
    return role === UserRole.ACCOUNTANT ? words.whoCabinet : words.whoAutomatic;
  }

  private phrase(entry: ExchangeHistoryEntry): string {
    const words = this.i18n.messages.cabinet.history;
    const towardCabinet =
      entry.direction === ExchangeDirection.COMPANY_TO_CABINET;
    switch (entry.kind) {
      case ExchangeEventKind.TRANSMITTED:
        return this.transmission(entry, towardCabinet);
      case ExchangeEventKind.RECEIVED:
        return towardCabinet ? words.receivedByCabinet : words.receivedByCompany;
      case ExchangeEventKind.CONSULTED:
        return towardCabinet
          ? words.consultedByCabinet
          : words.consultedByCompany;
      default:
        return towardCabinet
          ? words.downloadedByCabinet
          : words.downloadedByCompany;
    }
  }

  private transmission(
    entry: ExchangeHistoryEntry,
    towardCabinet: boolean,
  ): string {
    const words = this.i18n.messages.cabinet.history;
    if (entry.documentCount <= 1) {
      return towardCabinet
        ? words.transmittedToCabinet
        : words.transmittedToCompany;
    }
    const grouped = towardCabinet
      ? words.transmittedToCabinetMany
      : words.transmittedToCompanyMany;
    return grouped.replace('{count}', String(entry.documentCount));
  }

  private formatInstant(isoInstant: string): string {
    const [date = '', time = ''] = isoInstant.split('T');
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} ${time.slice(0, 5)}`;
  }
}
