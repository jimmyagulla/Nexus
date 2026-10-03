import { describe, expect, it } from 'vitest';
import { BusinessError } from '../errors/business-error';
import { BusinessErrorCode } from '../errors/business-error-codes';
import { Company } from './company';
import { Weekday } from '../value-objects/weekday';

describe('Company', () => {
  it('creates a company with a non-empty name and default calendar', () => {
    const company = Company.create('Acme RH');

    expect(company.name).toBe('Acme RH');
    expect(company.nonWorkingWeekdays).toEqual([
      Weekday.SATURDAY,
      Weekday.SUNDAY,
    ]);
    expect(company.holidays).toEqual([]);
    expect(company.id).toMatch(/^company-/);
  });

  it('rejects an empty name with INFORMATION_OBLIGATOIRE', () => {
    expect(() => Company.create('   ')).toThrow(BusinessError);
    try {
      Company.create('');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessError);
      expect((error as BusinessError).code).toBe(
        BusinessErrorCode.INFORMATION_OBLIGATOIRE,
      );
    }
  });
});
