import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { AppRoutes } from '../../infrastructure/ui/routes/app-routes';
import { NavigationPresenter } from './navigation.presenter';

const presenter = new NavigationPresenter();

describe('NavigationPresenter', () => {
  it('offers the employer the dashboard, the settings and the accounting firm', () => {
    expect(presenter.present(UserRole.EMPLOYER)).toEqual([
      { id: 'dashboard', to: AppRoutes.home, label: 'Tableau de bord' },
      { id: 'settings', to: AppRoutes.settings, label: 'Paramètres' },
      { id: 'cabinet', to: AppRoutes.cabinet, label: 'Cabinet comptable' },
    ]);
  });

  it('offers the cabinet its documents and nothing of the company space', () => {
    expect(presenter.present(UserRole.ACCOUNTANT)).toEqual([
      {
        id: 'receivedDocuments',
        to: AppRoutes.receivedDocuments,
        label: 'Documents reçus',
      },
    ]);
  });

  it('keeps the accounting firm out of the way of anyone else', () => {
    for (const role of [UserRole.EMPLOYEE, null]) {
      expect(
        presenter.present(role).map((entry) => entry.id),
      ).toEqual(['dashboard', 'settings']);
    }
  });
});
