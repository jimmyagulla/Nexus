import { UserRole } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../infrastructure/ui/i18n/i18n';
import { AppRoutes } from '../../infrastructure/ui/routes/app-routes';

export type NavigationEntryId =
  | 'dashboard'
  | 'settings'
  | 'cabinet'
  | 'receivedDocuments';

export interface NavigationEntryViewModel {
  id: NavigationEntryId;
  to: string;
  label: string;
}

export class NavigationPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(role: UserRole | null): NavigationEntryViewModel[] {
    return this.idsFor(role).map((id) => this.entry(id));
  }

  private idsFor(role: UserRole | null): NavigationEntryId[] {
    if (role === UserRole.ACCOUNTANT) {
      return ['receivedDocuments'];
    }
    if (role === UserRole.EMPLOYER) {
      return ['dashboard', 'settings', 'cabinet'];
    }
    return ['dashboard', 'settings'];
  }

  private entry(id: NavigationEntryId): NavigationEntryViewModel {
    const paths: Record<NavigationEntryId, string> = {
      dashboard: AppRoutes.home,
      settings: AppRoutes.settings,
      cabinet: AppRoutes.cabinet,
      receivedDocuments: AppRoutes.receivedDocuments,
    };
    return {
      id,
      to: paths[id],
      label: this.i18n.messages.navigation[id],
    };
  }
}
