import { describe, expect, it } from 'vitest';
import { PresenceMonth } from '@hexagonal-monorepo-template/domain';
import { InMemoryPresenceRepository } from './in-memory-presence.repository';

const ASSIGNED_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const october = PresenceMonth.parse('2026-10');

describe('InMemoryPresenceRepository', () => {
  it('assigns an id when inserting a presence', async () => {
    const presences = new InMemoryPresenceRepository();

    const presence = await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    expect(presence.id).toMatch(ASSIGNED_ID);
    expect(presence).toMatchObject({
      companyId: 'c1',
      employeeId: 'e1',
      workedDays: 22,
    });
    expect(presence.month.value).toBe('2026-10');
  });

  it('starts a new presence with its worked days as the proposed ones', async () => {
    const presences = new InMemoryPresenceRepository();

    const presence = await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    expect(presence.proposedWorkedDays).toBe(22);
    expect(presence.adjustments).toEqual([]);
  });

  it('finds a presence by its id inside its company', async () => {
    const presences = new InMemoryPresenceRepository();
    const inserted = await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    expect(await presences.findById('c1', inserted.id)).toEqual(inserted);
  });

  it('finds nothing by the id of a presence of another company', async () => {
    const presences = new InMemoryPresenceRepository();
    const inserted = await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    expect(await presences.findById('c2', inserted.id)).toBeNull();
  });

  it('finds nothing by an unknown id', async () => {
    expect(
      await new InMemoryPresenceRepository().findById('c1', 'missing'),
    ).toBeNull();
  });

  it('keeps the adjustments of a presence it saved', async () => {
    const presences = new InMemoryPresenceRepository();
    const inserted = await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });
    const adjusted = inserted.adjustWorkedDays(
      20,
      'user-1',
      new Date('2026-10-13T09:00:00.000Z'),
    );

    await presences.save(adjusted);

    expect(await presences.findById('c1', inserted.id)).toEqual(adjusted);
    expect(
      await presences.findByEmployeeAndMonth('c1', 'e1', october),
    ).toEqual(adjusted);
    expect(await presences.list({ companyId: 'c1' })).toEqual([adjusted]);
  });

  it('finds the presence of an employee for a month', async () => {
    const presences = new InMemoryPresenceRepository();
    const inserted = await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    expect(
      await presences.findByEmployeeAndMonth('c1', 'e1', october),
    ).toEqual(inserted);
  });

  it('finds nothing for an employee, a month or a company it never held', async () => {
    const presences = new InMemoryPresenceRepository();
    await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    expect(
      await presences.findByEmployeeAndMonth('c1', 'e2', october),
    ).toBeNull();
    expect(
      await presences.findByEmployeeAndMonth(
        'c1',
        'e1',
        PresenceMonth.parse('2026-11'),
      ),
    ).toBeNull();
    expect(
      await presences.findByEmployeeAndMonth('c2', 'e1', october),
    ).toBeNull();
  });

  it('lists the presences of one company only', async () => {
    const presences = new InMemoryPresenceRepository();
    const mine = await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });
    await presences.insert({
      companyId: 'c2',
      employeeId: 'e9',
      month: october,
      workedDays: 20,
    });

    expect(await presences.list({ companyId: 'c1' })).toEqual([mine]);
  });

  it('lists the presences of one employee only', async () => {
    const presences = new InMemoryPresenceRepository();
    const mine = await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });
    await presences.insert({
      companyId: 'c1',
      employeeId: 'e2',
      month: october,
      workedDays: 20,
    });

    expect(
      await presences.list({ companyId: 'c1', employeeId: 'e1' }),
    ).toEqual([mine]);
  });

  describe('filtered by period', () => {
    async function threeMonths() {
      const presences = new InMemoryPresenceRepository();
      const inserted = [];
      for (const month of ['2026-08', '2026-09', '2026-10']) {
        inserted.push(
          await presences.insert({
            companyId: 'c1',
            employeeId: 'e1',
            month: PresenceMonth.parse(month),
            workedDays: 20,
          }),
        );
      }
      return { presences, inserted };
    }

    const months = (list: readonly { month: PresenceMonth }[]) =>
      list.map((presence) => presence.month.value).sort();

    it('keeps the months from the start month on', async () => {
      const { presences } = await threeMonths();

      expect(
        months(
          await presences.list({
            companyId: 'c1',
            from: PresenceMonth.parse('2026-09'),
          }),
        ),
      ).toEqual(['2026-09', '2026-10']);
    });

    it('keeps the months up to the end month', async () => {
      const { presences } = await threeMonths();

      expect(
        months(
          await presences.list({
            companyId: 'c1',
            to: PresenceMonth.parse('2026-09'),
          }),
        ),
      ).toEqual(['2026-08', '2026-09']);
    });

    it('keeps only the months between both bounds, bounds included', async () => {
      const { presences } = await threeMonths();

      expect(
        months(
          await presences.list({
            companyId: 'c1',
            from: PresenceMonth.parse('2026-09'),
            to: PresenceMonth.parse('2026-09'),
          }),
        ),
      ).toEqual(['2026-09']);
    });

    it('compares months across years', async () => {
      const { presences } = await threeMonths();
      await presences.insert({
        companyId: 'c1',
        employeeId: 'e1',
        month: PresenceMonth.parse('2025-12'),
        workedDays: 20,
      });

      expect(
        months(
          await presences.list({
            companyId: 'c1',
            from: PresenceMonth.parse('2026-01'),
          }),
        ),
      ).toEqual(['2026-08', '2026-09', '2026-10']);
    });
  });

  it('lists nothing for a company without presences', async () => {
    const presences = new InMemoryPresenceRepository();

    expect(await presences.list({ companyId: 'c1' })).toEqual([]);
  });
});
