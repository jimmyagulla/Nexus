import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { EmployeeWorkspacePresenter } from './employee-workspace.presenter';

const opened = {
  session: {
    accessToken: 'session:alice',
    companyId: 'c1',
    role: UserRole.EMPLOYEE,
  },
  employee: { id: 'e1', firstName: 'Alice', lastName: 'Martin' },
};

describe('EmployeeWorkspacePresenter', () => {
  it('names the workspace after its employee', () => {
    expect(new EmployeeWorkspacePresenter().present(opened).fullName).toBe(
      'Alice Martin',
    );
  });

  it('keeps no trailing space when the last name is missing', () => {
    const model = new EmployeeWorkspacePresenter().present({
      ...opened,
      employee: { ...opened.employee, lastName: '' },
    });

    expect(model.fullName).toBe('Alice');
  });
});
