import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { PublicHolidayRequestDto } from './public-holiday-request.dto';

function validate(payload: unknown): Promise<PublicHolidayRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: PublicHolidayRequestDto,
  });
}

describe('PublicHolidayRequestDto', () => {
  it('accepts a calendar date and a label', async () => {
    await expect(
      validate({ date: '2026-07-14', label: 'Fête nationale' }),
    ).resolves.toMatchObject({
      date: '2026-07-14',
      label: 'Fête nationale',
    });
  });

  it('rejects a missing date', async () => {
    await expect(validate({ label: 'Fête' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it.each([
    '14/07/2026',
    '14-07-2026',
    '2026-7-4',
    '2026-07-14T00:00:00.000Z',
    'tomorrow',
    '',
  ])('rejects the malformed date %s', async (date) => {
    await expect(validate({ date, label: 'Fête' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a date that is not a string', async () => {
    await expect(
      validate({ date: 20260714, label: 'Fête' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a missing label', async () => {
    await expect(validate({ date: '2026-07-14' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects an empty label', async () => {
    await expect(
      validate({ date: '2026-07-14', label: '' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a label that is not a string', async () => {
    await expect(
      validate({ date: '2026-07-14', label: 14 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a payload carrying an unexpected property', async () => {
    await expect(
      validate({ date: '2026-07-14', label: 'Fête', id: 'holiday-1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
