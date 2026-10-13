import { PresenceListSnapshot } from '@hexagonal-monorepo-template/domain';
import { en } from '../../infrastructure/ui/i18n/en';
import { fr } from '../../infrastructure/ui/i18n/fr';
import { I18n } from '../../infrastructure/ui/i18n/i18n';
import { PresencePresenter } from './presence.presenter';

const list: PresenceListSnapshot = {
  presences: [
    {
      id: 'p1',
      employeeId: 'e1',
      employeeName: 'Camille Martin',
      month: '2026-10',
      workedDays: 22,
    },
  ],
  employees: [
    { id: 'e1', companyId: 'c1', fullName: 'Camille Martin' },
    { id: 'e2', companyId: 'c1', fullName: 'Dominique Durand' },
  ],
  canManage: true,
};

describe('PresencePresenter', () => {
  it('presents each month as a row the screen can display', () => {
    expect(new PresencePresenter().present(list).rows).toEqual([
      {
        id: 'p1',
        employeeName: 'Camille Martin',
        monthLabel: 'Octobre 2026',
        workedDays: 22,
      },
    ]);
  });

  it('names the month in the active language', () => {
    const presenter = new PresencePresenter(new I18n({ fr, en }, 'en'));

    expect(presenter.present(list).rows[0]?.monthLabel).toBe('October 2026');
  });

  it('offers every employee of the company to open a month for', () => {
    expect(new PresencePresenter().present(list).employees).toEqual([
      { value: 'e1', label: 'Camille Martin' },
      { value: 'e2', label: 'Dominique Durand' },
    ]);
  });

  it('tells whether the actor may manage the months', () => {
    const presenter = new PresencePresenter();

    expect(presenter.present(list).canManage).toBe(true);
    expect(presenter.present({ ...list, canManage: false }).canManage).toBe(
      false,
    );
  });
});
