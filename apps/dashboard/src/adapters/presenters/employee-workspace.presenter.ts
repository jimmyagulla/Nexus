import { OpenedEmployeeWorkspace } from '@hexagonal-monorepo-template/domain';

export type EmployeeWorkspaceViewModel = {
  fullName: string;
};

export class EmployeeWorkspacePresenter {
  present(opened: OpenedEmployeeWorkspace): EmployeeWorkspaceViewModel {
    return { fullName: this.fullName(opened.employee) };
  }

  private fullName(employee: { firstName: string; lastName: string }): string {
    return [employee.firstName, employee.lastName]
      .filter((part) => part !== '')
      .join(' ');
  }
}
