import type { StatusViewModel } from '../display.types';

export interface EmployeeViewModel {
  employee: EmployeeHeaderModel;
  summary: SpaceSummaryTileModel[];
  identity: IdentityRowModel[];
  history: ActionHistoryItemModel[];
}

export interface ActionHistoryItemModel {
  label: string;
  date: string;
}

export interface EmployeeHeaderModel {
  id: string;
  initials: string;
  name: string;
  status: StatusViewModel;
  meta: string;
}

export interface IdentityRowModel {
  label: string;
  value: string;
}

export interface SpaceSummaryTileModel {
  icon: string;
  label: string;
  value: string;
  hint: string;
}

/**
 * Presents one employee space.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class EmployeePresenter {
  present(employee: EmployeeViewModel): EmployeeViewModel {
    return employee;
  }
}
