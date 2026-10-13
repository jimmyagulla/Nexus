/** View models of the employee dashboard screens, produced by their presenters. */

import type { FlowTone, NavigationTarget, StatusViewModel } from '../display.view-models';

export interface EmployeeDashboardViewModel {
  firstName: string;
  lastLogin: string;
  leaveBalance: LeaveBalanceModel;
  flows: FlowTileModel[];
  activities: ActivityModel[];
  mobile: {
    payslipBanner: PayslipBannerModel;
    flows: MobileFlowRowModel[];
  };
}

export interface ActivityModel {
  id: string;
  /** Remix Icon class, e.g. `ri-sun-line`. */
  icon: string;
  tone: FlowTone;
  title: string;
  detail: string;
  status: StatusViewModel;
}

export interface FlowTileModel {
  id: string;
  /** Remix Icon class, e.g. `ri-folder-shield-2-line`. */
  icon: string;
  tone: FlowTone;
  label: string;
  value: string;
  action: string;
  link: NavigationTarget;
}

export interface LeaveBalanceModel {
  available: string;
  period: string;
  ring: LeaveBalanceRingModel;
  items: LeaveBalanceItemModel[];
  nextLeave: { dates: string; status: StatusViewModel };
}

export type LeaveBalanceKind = 'acquired' | 'taken' | 'pending' | 'remaining';

export interface LeaveBalanceItemModel {
  kind: LeaveBalanceKind;
  label: string;
  value: string;
}

export interface LeaveBalanceRingModel {
  /** End of the "taken" arc, in % of the ring. */
  takenUntil: number;
  /** End of the "pending" arc, in % of the ring; the rest is the remaining balance. */
  pendingUntil: number;
}

export interface MobileFlowRowModel {
  id: string;
  /** Remix Icon class, e.g. `ri-sun-line`. */
  icon: string;
  title: string;
  detail: string;
  link: NavigationTarget;
}

export interface PayslipBannerModel {
  title: string;
  subtitle: string;
  link: NavigationTarget;
}

export interface QuickActionModel {
  id: string;
  /** Remix Icon class, e.g. `ri-time-line`. */
  icon: string;
  label: string;
  link: NavigationTarget;
  primary?: boolean;
}
