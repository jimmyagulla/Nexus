import {
  FixedClock,
  InMemoryAccountRepository,
  InMemoryAuditLogRepository,
  InMemoryEmployeeRepository,
  InMemorySecondFactorEnrollmentRepository,
  InMemorySecretHasher,
  InMemorySignInSession,
  TotpSecondFactorCodes,
} from '@hexagonal-monorepo-template/adapters';
import {
  Account,
  AccountIdentifier,
  Employee,
  EmployeeStatus,
  ErrorCode,
  SecondFactorEnrollment,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { SignInUseCase } from '../account/sign-in.use-case';
import { ConfirmSecondFactorEnrollmentUseCase } from './confirm-second-factor-enrollment.use-case';

// RFC 6238 appendix B: at 59 s the code of this secret is 287082.
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
const VALID_CODE = '287082';
const OPENED_AT = new Date(59_000);

type Person = {
  accountId: string;
  identifier: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  enrollmentId: string;
};

const alice: Person = {
  accountId: 'account-1',
  identifier: 'alice',
  employeeId: 'e1',
  firstName: 'Alice',
  lastName: 'Martin',
  enrollmentId: 'enrollment-1',
};

const bruno: Person = {
  accountId: 'account-2',
  identifier: 'bruno',
  employeeId: 'e2',
  firstName: 'Bruno',
  lastName: 'Durand',
  enrollmentId: 'enrollment-2',
};

async function setup(
  people: readonly Person[] = [alice],
  status: EmployeeStatus = EmployeeStatus.ACTIVE,
) {
  const accounts = new InMemoryAccountRepository();
  const employees = new InMemoryEmployeeRepository();
  const enrollments = new InMemorySecondFactorEnrollmentRepository();
  const secrets = new InMemorySecretHasher();
  const sessions = new InMemorySignInSession();
  for (const person of people) {
    const invited = Account.inviteEmployee(
      person.accountId,
      'c1',
      AccountIdentifier.parse(person.identifier),
      `invite-${person.accountId}`,
      person.employeeId,
    );
    await accounts.insert(invited.activate(await secrets.hash('s3cret')));
    await employees.insert(
      new Employee(
        person.employeeId,
        'c1',
        person.firstName,
        person.lastName,
        status,
        null,
      ),
    );
    await enrollments.insert(
      SecondFactorEnrollment.start(
        person.enrollmentId,
        person.accountId,
        RFC_SECRET,
      ),
    );
  }
  return {
    accounts,
    employees,
    enrollments,
    secrets,
    sessions,
    useCase: new ConfirmSecondFactorEnrollmentUseCase(
      enrollments,
      accounts,
      employees,
      new TotpSecondFactorCodes(),
      sessions,
      new FixedClock(OPENED_AT),
    ),
  };
}

describe('ConfirmSecondFactorEnrollmentUseCase', () => {
  it('opens the workspace of the employee once the code is proven', async () => {
    const { useCase } = await setup();

    const opened = await useCase.execute({
      enrollmentId: 'enrollment-1',
      code: VALID_CODE,
    });

    expect(opened).toEqual({
      session: {
        accessToken: 'session:alice',
        companyId: 'c1',
        role: UserRole.EMPLOYEE,
      },
      employee: { id: 'e1', firstName: 'Alice', lastName: 'Martin' },
    });
  });

  it('terminates the enrollment', async () => {
    const { enrollments, useCase } = await setup();

    await useCase.execute({ enrollmentId: 'enrollment-1', code: VALID_CODE });

    expect((await enrollments.findById('enrollment-1'))?.isConfirmed()).toBe(
      true,
    );
  });

  it('records the last activity of the employee record', async () => {
    const { employees, useCase } = await setup();

    await useCase.execute({ enrollmentId: 'enrollment-1', code: VALID_CODE });

    expect((await employees.findById('e1'))?.lastActivityAt).toEqual(OPENED_AT);
  });

  it('presents the workspace of the one who confirmed, and nobody else', async () => {
    const { useCase } = await setup([alice, bruno]);

    const opened = await useCase.execute({
      enrollmentId: 'enrollment-2',
      code: VALID_CODE,
    });

    expect(opened.employee).toEqual({
      id: 'e2',
      firstName: 'Bruno',
      lastName: 'Durand',
    });
    expect(opened.session.accessToken).toBe('session:bruno');
  });

  it('leaves the activity of the other records untouched', async () => {
    const { employees, useCase } = await setup([alice, bruno]);

    await useCase.execute({ enrollmentId: 'enrollment-2', code: VALID_CODE });

    expect((await employees.findById('e1'))?.lastActivityAt).toBeNull();
  });

  it('lifts the closed workspace at the next sign-in', async () => {
    const { accounts, enrollments, secrets, sessions, useCase } = await setup();
    const signIn = new SignInUseCase(
      accounts,
      secrets,
      sessions,
      new InMemoryAuditLogRepository(),
      new FixedClock(OPENED_AT),
      enrollments,
    );
    await expect(
      signIn.execute({ identifier: 'alice', secret: 's3cret' }),
    ).rejects.toThrow(ErrorCode.SECOND_FACTOR_REQUIRED);

    await useCase.execute({ enrollmentId: 'enrollment-1', code: VALID_CODE });

    await expect(
      signIn.execute({ identifier: 'alice', secret: 's3cret' }),
    ).resolves.toMatchObject({ role: UserRole.EMPLOYEE });
  });

  it('opens the workspace of a record closed since, to consult it', async () => {
    const { useCase } = await setup([alice], EmployeeStatus.INACTIVE);

    await expect(
      useCase.execute({ enrollmentId: 'enrollment-1', code: VALID_CODE }),
    ).resolves.toMatchObject({ employee: { id: 'e1' } });
  });

  describe('when the confirmation is refused', () => {
    it('keeps the enrollment pending and opens nothing for a wrong code', async () => {
      const { employees, enrollments, sessions, useCase } = await setup();

      await expect(
        useCase.execute({ enrollmentId: 'enrollment-1', code: '000000' }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);

      expect((await enrollments.findById('enrollment-1'))?.isConfirmed()).toBe(
        false,
      );
      expect(sessions.opened).toEqual([]);
      expect((await employees.findById('e1'))?.lastActivityAt).toBeNull();
    });

    it('lets the employee try again after a wrong code', async () => {
      const { useCase } = await setup();
      await useCase
        .execute({ enrollmentId: 'enrollment-1', code: '000000' })
        .catch(() => undefined);

      await expect(
        useCase.execute({ enrollmentId: 'enrollment-1', code: VALID_CODE }),
      ).resolves.toMatchObject({ employee: { id: 'e1' } });
    });

    it('refuses an empty code', async () => {
      const { useCase } = await setup();

      await expect(
        useCase.execute({ enrollmentId: 'enrollment-1', code: '' }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    });

    it('refuses an enrollment nobody started, as an access denial', async () => {
      const { sessions, useCase } = await setup();

      await expect(
        useCase.execute({ enrollmentId: 'unknown', code: VALID_CODE }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
      expect(sessions.opened).toEqual([]);
    });

    it('refuses to open a second workspace from an enrollment already confirmed', async () => {
      const { sessions, useCase } = await setup();
      await useCase.execute({ enrollmentId: 'enrollment-1', code: VALID_CODE });

      await expect(
        useCase.execute({ enrollmentId: 'enrollment-1', code: VALID_CODE }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
      expect(sessions.opened).toHaveLength(1);
    });

    it('refuses an enrollment whose account is not an active employee account', async () => {
      const { accounts, enrollments, useCase } = await setup();
      await accounts.insert(
        Account.inviteEmployer(
          'account-9',
          'c1',
          AccountIdentifier.parse('founder'),
          'invite-9',
        ),
      );
      await enrollments.insert(
        SecondFactorEnrollment.start('enrollment-9', 'account-9', RFC_SECRET),
      );

      await expect(
        useCase.execute({ enrollmentId: 'enrollment-9', code: VALID_CODE }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    });

    it('refuses an enrollment whose account does not exist', async () => {
      const { enrollments, useCase } = await setup();
      await enrollments.insert(
        SecondFactorEnrollment.start('enrollment-8', 'ghost', RFC_SECRET),
      );

      await expect(
        useCase.execute({ enrollmentId: 'enrollment-8', code: VALID_CODE }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    });

    it('confirms nothing when the employee record is missing', async () => {
      const { accounts, enrollments, sessions, useCase } = await setup();
      const orphan = Account.inviteEmployee(
        'account-7',
        'c1',
        AccountIdentifier.parse('orphan'),
        'invite-7',
        'missing-employee',
      ).activate('hashed:s3cret');
      await accounts.insert(orphan);
      await enrollments.insert(
        SecondFactorEnrollment.start('enrollment-7', 'account-7', RFC_SECRET),
      );

      await expect(
        useCase.execute({ enrollmentId: 'enrollment-7', code: VALID_CODE }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
      expect((await enrollments.findById('enrollment-7'))?.isConfirmed()).toBe(
        false,
      );
      expect(sessions.opened).toEqual([]);
    });
  });
});
