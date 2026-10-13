import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { AdjustWorkedDaysRequestDto } from './adjust-worked-days-request.dto';

function validate(payload: unknown): Promise<AdjustWorkedDaysRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: AdjustWorkedDaysRequestDto,
  });
}

describe('AdjustWorkedDaysRequestDto', () => {
  it('accepts a whole number of days', async () => {
    await expect(validate({ workedDays: 20 })).resolves.toMatchObject({
      workedDays: 20,
    });
  });

  it('accepts no worked day at all', async () => {
    await expect(validate({ workedDays: 0 })).resolves.toMatchObject({
      workedDays: 0,
    });
  });

  it('rejects a negative number of days', async () => {
    await expect(validate({ workedDays: -1 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a fraction of a day', async () => {
    await expect(validate({ workedDays: 20.5 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects more days than any month holds', async () => {
    await expect(validate({ workedDays: 32 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a number written as text', async () => {
    await expect(validate({ workedDays: '20' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a missing number of days', async () => {
    await expect(validate({})).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a payload carrying an unexpected property', async () => {
    await expect(
      validate({ workedDays: 20, proposedWorkedDays: 22 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
