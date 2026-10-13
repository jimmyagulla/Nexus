import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../common/pipes/create-validation.pipe';
import { ListPresencesQueryDto } from './list-presences-query.dto';

function validate(payload: unknown): Promise<ListPresencesQueryDto> {
  return createValidationPipe().transform(payload, {
    type: 'query',
    metatype: ListPresencesQueryDto,
  });
}

describe('ListPresencesQueryDto', () => {
  it('accepts a query without any filter', async () => {
    await expect(validate({})).resolves.toMatchObject({});
  });

  it('accepts an employee and a period', async () => {
    await expect(
      validate({ employeeId: 'e1', from: '2026-08', to: '2026-10' }),
    ).resolves.toMatchObject({ employeeId: 'e1', from: '2026-08', to: '2026-10' });
  });

  it.each(['2026-13', '2026-1', '2026-10-05', 'october'])(
    'rejects the malformed start month %s',
    async (from) => {
      await expect(validate({ from })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each(['2026-13', '2026-1', '2026-10-05', 'october'])(
    'rejects the malformed end month %s',
    async (to) => {
      await expect(validate({ to })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it('rejects an empty employee', async () => {
    await expect(validate({ employeeId: '' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects a query carrying an unexpected filter', async () => {
    await expect(validate({ status: 'open' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
