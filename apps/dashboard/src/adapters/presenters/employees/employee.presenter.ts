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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class EmployeePresenter {
  constructor(private readonly placeholder: EmployeeViewModel) {}

  present(): EmployeeViewModel {
    return this.placeholder;
  }
}
