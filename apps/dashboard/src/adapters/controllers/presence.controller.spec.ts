import {
  PresenceListFilter,
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import { PresenceController } from './presence.controller';

const list: PresenceListSnapshot = {
  presences: [],
  employees: [],
  canManage: true,
};

const opened: PresenceSnapshot = {
  id: 'p1',
  employeeId: 'e1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 22,
  proposedWorkedDays: 22,
  adjustments: [],
  leaves: [],
  absences: [],
  sickLeaves: [],
  overtime: [],
};

const corrected: PresenceSnapshot = { ...opened, workedDays: 20 };

function controllerWith(
  overrides: {
    list?: (filter?: PresenceListFilter) => Promise<PresenceListSnapshot>;
    open?: (input: { employeeId: string; month: string }) => Promise<PresenceSnapshot>;
    adjust?: (input: {
      presenceId: string;
      workedDays: number;
    }) => Promise<PresenceSnapshot>;
  } = {},
) {
  return new PresenceController(
    { execute: overrides.list ?? (async () => list) },
    { execute: overrides.open ?? (async () => opened) },
    { execute: overrides.adjust ?? (async () => corrected) },
  );
}

describe('PresenceController', () => {
  it('lists the presences through the session use case', async () => {
    await expect(controllerWith().list()).resolves.toBe(list);
  });

  it('hands the filters to the session use case', async () => {
    const received: (PresenceListFilter | undefined)[] = [];
    const controller = controllerWith({
      list: async (filter) => {
        received.push(filter);
        return list;
      },
    });

    await controller.list({ employeeId: 'e1', from: '2026-08', to: '2026-10' });

    expect(received).toEqual([
      { employeeId: 'e1', from: '2026-08', to: '2026-10' },
    ]);
  });

  it('lists without filter when none is given', async () => {
    const received: (PresenceListFilter | undefined)[] = [];
    const controller = controllerWith({
      list: async (filter) => {
        received.push(filter);
        return list;
      },
    });

    await controller.list();

    expect(received).toEqual([{}]);
  });

  it('opens a month through the session use case', async () => {
    const received: { employeeId: string; month: string }[] = [];
    const controller = controllerWith({
      open: async (input) => {
        received.push(input);
        return opened;
      },
    });

    await expect(
      controller.open({ employeeId: 'e1', month: '2026-10' }),
    ).resolves.toBe(opened);
    expect(received).toEqual([{ employeeId: 'e1', month: '2026-10' }]);
  });

  it('corrects the worked days through the session use case', async () => {
    const received: { presenceId: string; workedDays: number }[] = [];
    const controller = controllerWith({
      adjust: async (input) => {
        received.push(input);
        return corrected;
      },
    });

    await expect(
      controller.adjustWorkedDays({ presenceId: 'p1', workedDays: 20 }),
    ).resolves.toBe(corrected);
    expect(received).toEqual([{ presenceId: 'p1', workedDays: 20 }]);
  });
});
