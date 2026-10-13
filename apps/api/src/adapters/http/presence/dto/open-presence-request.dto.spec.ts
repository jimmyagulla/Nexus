import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { OpenPresenceRequestDto } from './open-presence-request.dto';

function validate(payload: unknown): Promise<OpenPresenceRequestDto> {
  return createValidationPipe().transform(payload, {
    type: 'body',
    metatype: OpenPresenceRequestDto,
  });
}

describe('OpenPresenceRequestDto', () => {
  it('accepts an employee and a calendar month', async () => {
    await expect(
      validate({ employeeId: 'e1', month: '2026-10' }),
    ).resolves.toMatchObject({ employeeId: 'e1', month: '2026-10' });
  });

  it.each(['2026-13', '2026-1', '2026-10-05', 'october', ''])(
    'rejects the malformed month %s',
    async (month) => {
      await expect(
        validate({ employeeId: 'e1', month }),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it('rejects a missing month', async () => {
    await expect(validate({ employeeId: 'e1' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a month that is not a string', async () => {
    await expect(
      validate({ employeeId: 'e1', month: 202610 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a missing employee', async () => {
    await expect(validate({ month: '2026-10' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects an empty employee', async () => {
    await expect(
      validate({ employeeId: '', month: '2026-10' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a payload carrying an unexpected property', async () => {
    await expect(
      validate({ employeeId: 'e1', month: '2026-10', workedDays: 22 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
