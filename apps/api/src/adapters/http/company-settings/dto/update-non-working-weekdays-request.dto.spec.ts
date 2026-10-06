import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { UpdateNonWorkingWeekdaysRequestDto } from './update-non-working-weekdays-request.dto';

function validate(
  payload: unknown,
): Promise<UpdateNonWorkingWeekdaysRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: UpdateNonWorkingWeekdaysRequestDto,
  });
}

describe('UpdateNonWorkingWeekdaysRequestDto', () => {
  it('accepts a list of distinct weekdays', async () => {
    await expect(
      validate({ weekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY] }),
    ).resolves.toMatchObject({
      weekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    });
  });

  it('accepts an empty list, which means every weekday is worked', async () => {
    await expect(validate({ weekdays: [] })).resolves.toMatchObject({
      weekdays: [],
    });
  });

  it('rejects a missing list', async () => {
    await expect(validate({})).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a list that is not an array', async () => {
    await expect(
      validate({ weekdays: DayOfWeek.SUNDAY }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an unknown weekday', async () => {
    await expect(validate({ weekdays: ['FUNDAY'] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a lowercase weekday', async () => {
    await expect(validate({ weekdays: ['sunday'] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a repeated weekday', async () => {
    await expect(
      validate({ weekdays: [DayOfWeek.SUNDAY, DayOfWeek.SUNDAY] }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a payload carrying an unexpected property', async () => {
    await expect(
      validate({ weekdays: [], companyId: 'company-1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
