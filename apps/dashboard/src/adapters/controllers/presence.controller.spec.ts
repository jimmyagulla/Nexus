import {
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
    open?: (input: { employeeId: string; month: string }) => Promise<PresenceSnapshot>;
    adjust?: (input: {
      presenceId: string;
      workedDays: number;
    }) => Promise<PresenceSnapshot>;
  } = {},
) {
  return new PresenceController(
    { execute: async () => list },
    { execute: overrides.open ?? (async () => opened) },
    { execute: overrides.adjust ?? (async () => corrected) },
  );
}

describe('PresenceController', () => {
  it('lists the presences through the session use case', async () => {
    await expect(controllerWith().list()).resolves.toBe(list);
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
