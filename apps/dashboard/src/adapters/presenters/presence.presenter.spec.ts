import {
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
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
      leaves: [
        {
          id: 'a1',
          type: 'Congés payés',
          start: '2026-10-05',
          end: '2026-10-07',
          days: 3,
        },
        {
          id: 'a2',
          type: 'RTT',
          start: '2026-10-12',
          end: '2026-10-12',
          days: 1,
        },
      ],
      absences: [
        {
          id: 'a3',
          type: 'Absence exceptionnelle',
          start: '2026-10-20',
          end: '2026-10-21',
          days: 2,
        },
      ],
      sickLeaves: [{ id: 's1', date: '2026-10-14' }],
      overtime: [{ id: 'h1', date: '2026-10-15', hours: 2.5 }],
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
    expect(new PresencePresenter().present(list).rows[0]).toMatchObject({
      id: 'p1',
      employeeName: 'Camille Martin',
      monthLabel: 'Octobre 2026',
      workedDays: 22,
    });
  });

  it('writes a leave with its type, its period and its days', () => {
    expect(new PresencePresenter().present(list).rows[0]?.leaves).toEqual([
      'Congés payés : 05/10/2026 → 07/10/2026 (3 j)',
      'RTT : 12/10/2026 (1 j)',
    ]);
  });

  it('writes the absences the same way', () => {
    expect(new PresencePresenter().present(list).rows[0]?.absences).toEqual([
      'Absence exceptionnelle : 20/10/2026 → 21/10/2026 (2 j)',
    ]);
  });

  it('writes a sick leave with its date', () => {
    expect(new PresencePresenter().present(list).rows[0]?.sickLeaves).toEqual([
      '14/10/2026',
    ]);
  });

  it('writes the overtime with its date and its hours', () => {
    expect(new PresencePresenter().present(list).rows[0]?.overtime).toEqual([
      '15/10/2026 : 2,5 h',
    ]);
  });

  it('keeps an empty rubric empty instead of estimating it', () => {
    const [row] = new PresencePresenter().present({
      ...list,
      presences: [
        {
          ...(list.presences[0] as PresenceSnapshot),
          leaves: [],
          absences: [],
          sickLeaves: [],
          overtime: [],
        },
      ],
    }).rows;

    expect([row?.leaves, row?.absences, row?.sickLeaves, row?.overtime]).toEqual([
      [],
      [],
      [],
      [],
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
