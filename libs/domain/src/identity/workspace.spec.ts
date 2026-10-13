import { UserRole } from './user-role';
import { workspaceFor, Workspace } from './workspace';

describe('workspaceFor', () => {
  it('opens the company space for an employer', () => {
    expect(workspaceFor(UserRole.EMPLOYER)).toBe(Workspace.COMPANY);
  });

  it('maps a salaried account to the employee space', () => {
    expect(workspaceFor(UserRole.EMPLOYEE)).toBe(Workspace.EMPLOYEE);
  });

  it('maps an accountant account to the accountant space', () => {
    expect(workspaceFor(UserRole.ACCOUNTANT)).toBe(Workspace.ACCOUNTANT);
  });
});
