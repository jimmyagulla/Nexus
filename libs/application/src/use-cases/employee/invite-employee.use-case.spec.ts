import {
  InMemoryAccountRepository,
  InMemoryEmployeeRepository,
  UuidGenerator,
} from '@hexagonal-monorepo-template/adapters';
import {
  AccountStatus,
  ActorContext,
  Employee,
  EmployeeStatus,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { InviteEmployeeUseCase } from './invite-employee.use-case';

const employer: ActorContext = {
  userId: 'founder',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

function employee(id: string, companyId = 'c1'): Employee {
  return new Employee(
    id,
    companyId,
    'Alice',
    'Martin',
    EmployeeStatus.ACTIVE,
    null,
  );
}

async function setup(employees: readonly Employee[]) {
  const employeeRepository = new InMemoryEmployeeRepository();
  for (const record of employees) {
    await employeeRepository.insert(record);
  }
  const accounts = new InMemoryAccountRepository();
  return {
    accounts,
    useCase: new InviteEmployeeUseCase(
      employeeRepository,
      accounts,
      new UuidGenerator(),
    ),
  };
}

describe('InviteEmployeeUseCase', () => {
  it('opens an invited employee account bound to the record and its company', async () => {
    const { accounts, useCase } = await setup([employee('e1')]);

    const invitation = await useCase.execute({
      actor: employer,
      employeeId: 'e1',
      identifier: 'alice',
    });

    const account = await accounts.findByEmployeeId('e1');
    expect(account?.role).toBe(UserRole.EMPLOYEE);
    expect(account?.status).toBe(AccountStatus.INVITED);
    expect(account?.companyId).toBe('c1');
    expect(account?.identifier.value).toBe('alice');
    expect(invitation).toEqual({
      employeeId: 'e1',
      accountId: account?.id,
      identifier: 'alice',
      invitationToken: account?.invitationToken,
    });
    expect(invitation.invitationToken.length).toBeGreaterThan(0);
  });

  it('refuses an actor who is not an employer, and opens no account', async () => {
    const { accounts, useCase } = await setup([employee('e1')]);

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        employeeId: 'e1',
        identifier: 'alice',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(await accounts.findByEmployeeId('e1')).toBeNull();
  });

  it('refuses a record of another company, and opens no account', async () => {
    const { accounts, useCase } = await setup([employee('e1', 'c2')]);

    await expect(
      useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(await accounts.findByEmployeeId('e1')).toBeNull();
  });

  it('refuses a second account for a record that already has one', async () => {
    const { accounts, useCase } = await setup([employee('e1')]);
    await useCase.execute({
      actor: employer,
      employeeId: 'e1',
      identifier: 'alice',
    });
    const first = await accounts.findByEmployeeId('e1');
    if (first === null) {
      throw new Error('the first invitation must have opened an account');
    }
    await accounts.save(first.activate('hashed-secret'));

    await expect(
      useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice-bis',
      }),
    ).rejects.toThrow(ErrorCode.POTENTIAL_DUPLICATE);
    expect(await accounts.findByIdentifier('alice-bis')).toBeNull();
  });

  describe('a new invitation for an account still invited', () => {
    it('replaces the invitation and keeps the same account', async () => {
      const { accounts, useCase } = await setup([employee('e1')]);
      const first = await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      });

      const second = await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      });

      expect(second.accountId).toBe(first.accountId);
      expect(second.employeeId).toBe('e1');
      expect(second.invitationToken).not.toBe(first.invitationToken);
      expect(await accounts.listByCompany('c1')).toHaveLength(1);
    });

    it('leaves the previous invitation with nothing to open', async () => {
      const { accounts, useCase } = await setup([employee('e1')]);
      const first = await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      });

      const second = await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      });

      expect(await accounts.findByInvitationToken(first.invitationToken)).toBeNull();
      expect(
        (await accounts.findByInvitationToken(second.invitationToken))?.employeeId,
      ).toBe('e1');
    });

    it('takes the identifier submitted with the new invitation when it is free', async () => {
      const { accounts, useCase } = await setup([employee('e1')]);
      await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      });

      await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice.martin',
      });

      expect((await accounts.findByEmployeeId('e1'))?.identifier.value).toBe(
        'alice.martin',
      );
    });

    it('refuses an identifier held by another account, and keeps the previous invitation', async () => {
      const { accounts, useCase } = await setup([
        employee('e1'),
        employee('e2'),
      ]);
      const first = await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      });
      await useCase.execute({
        actor: employer,
        employeeId: 'e2',
        identifier: 'bruno',
      });

      await expect(
        useCase.execute({
          actor: employer,
          employeeId: 'e1',
          identifier: 'bruno',
        }),
      ).rejects.toThrow(ErrorCode.POTENTIAL_DUPLICATE);
      expect(
        (await accounts.findByInvitationToken(first.invitationToken))?.employeeId,
      ).toBe('e1');
    });

    it('does not reach the invitation of another record', async () => {
      const { accounts, useCase } = await setup([
        employee('e1'),
        employee('e2'),
      ]);
      await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      });
      const other = await useCase.execute({
        actor: employer,
        employeeId: 'e2',
        identifier: 'bruno',
      });

      await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      });

      expect(
        (await accounts.findByInvitationToken(other.invitationToken))?.employeeId,
      ).toBe('e2');
    });
  });

  it('refuses an identifier already held by another account', async () => {
    const { accounts, useCase } = await setup([
      employee('e1'),
      employee('e2'),
    ]);
    await useCase.execute({
      actor: employer,
      employeeId: 'e1',
      identifier: 'alice',
    });

    await expect(
      useCase.execute({
        actor: employer,
        employeeId: 'e2',
        identifier: 'alice',
      }),
    ).rejects.toThrow(ErrorCode.POTENTIAL_DUPLICATE);
    expect(await accounts.findByEmployeeId('e2')).toBeNull();
  });

  it('refuses a missing identifier, and opens no account', async () => {
    const { accounts, useCase } = await setup([employee('e1')]);

    await expect(
      useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: '   ',
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(await accounts.findByEmployeeId('e1')).toBeNull();
  });

  it('gives each record its own invitation', async () => {
    const { useCase } = await setup([employee('e1'), employee('e2')]);

    const first = await useCase.execute({
      actor: employer,
      employeeId: 'e1',
      identifier: 'alice',
    });
    const second = await useCase.execute({
      actor: employer,
      employeeId: 'e2',
      identifier: 'bruno',
    });

    expect(first.employeeId).toBe('e1');
    expect(second.employeeId).toBe('e2');
    expect(first.invitationToken).not.toBe(second.invitationToken);
  });

  describe('an inactive employee record', () => {
    function inactive(id: string, companyId = 'c1'): Employee {
      return new Employee(
        id,
        companyId,
        'Alice',
        'Martin',
        EmployeeStatus.INACTIVE,
        null,
      );
    }

    it('is refused as inactive, and opens no account', async () => {
      const { accounts, useCase } = await setup([inactive('e1')]);

      await expect(
        useCase.execute({
          actor: employer,
          employeeId: 'e1',
          identifier: 'alice',
        }),
      ).rejects.toThrow(ErrorCode.EMPLOYEE_INACTIVE);
      expect(await accounts.findByEmployeeId('e1')).toBeNull();
    });

    it('is refused as inactive when it already holds an invitation, which stays as it was', async () => {
      const employees = new InMemoryEmployeeRepository();
      await employees.insert(employee('e1'));
      const accounts = new InMemoryAccountRepository();
      const useCase = new InviteEmployeeUseCase(
        employees,
        accounts,
        new UuidGenerator(),
      );
      const first = await useCase.execute({
        actor: employer,
        employeeId: 'e1',
        identifier: 'alice',
      });
      await employees.save(inactive('e1'));

      await expect(
        useCase.execute({
          actor: employer,
          employeeId: 'e1',
          identifier: 'alice',
        }),
      ).rejects.toThrow(ErrorCode.EMPLOYEE_INACTIVE);
      expect(
        (await accounts.findByInvitationToken(first.invitationToken))?.employeeId,
      ).toBe('e1');
    });

    it('does not tell an actor of another company that the record exists', async () => {
      const { useCase } = await setup([inactive('e1', 'c2')]);

      await expect(
        useCase.execute({
          actor: employer,
          employeeId: 'e1',
          identifier: 'alice',
        }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    });

    it('does not tell an actor who is not an employer that the record is inactive', async () => {
      const { useCase } = await setup([inactive('e1')]);

      await expect(
        useCase.execute({
          actor: { ...employer, role: UserRole.EMPLOYEE },
          employeeId: 'e1',
          identifier: 'alice',
        }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    });

    it('does not block the invitation of an active record of the same company', async () => {
      const { useCase } = await setup([inactive('e1'), employee('e2')]);

      await expect(
        useCase.execute({
          actor: employer,
          employeeId: 'e2',
          identifier: 'bruno',
        }),
      ).resolves.toMatchObject({ employeeId: 'e2' });
    });
  });

  it('refuses a record that does not exist, as an access denial', async () => {
    const { useCase } = await setup([]);

    await expect(
      useCase.execute({
        actor: employer,
        employeeId: 'missing',
        identifier: 'alice',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
