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
  leaves: [],
  absences: [],
  sickLeaves: [],
  overtime: [],
};

describe('PresenceController', () => {
  it('lists the presences through the session use case', async () => {
    const controller = new PresenceController(
      { execute: async () => list },
      { execute: async () => opened },
    );

    await expect(controller.list()).resolves.toBe(list);
  });

  it('opens a month through the session use case', async () => {
    const received: { employeeId: string; month: string }[] = [];
    const controller = new PresenceController(
      { execute: async () => list },
      {
        execute: async (input) => {
          received.push(input);
          return opened;
        },
      },
    );

    await expect(
      controller.open({ employeeId: 'e1', month: '2026-10' }),
    ).resolves.toBe(opened);
    expect(received).toEqual([{ employeeId: 'e1', month: '2026-10' }]);
  });
});
