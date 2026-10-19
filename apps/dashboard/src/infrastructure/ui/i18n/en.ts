import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { common } from './en/common';
import { shell } from './en/shell';
import { auth } from './en/auth';
import { employeeDashboard } from './en/employee-dashboard';
import { payslips } from './en/payslips';
import { documents } from './en/documents';
import { personalInfo } from './en/personal-info';
import { leaves } from './en/leaves';
import { overtime } from './en/overtime';
import { expenseReports } from './en/expense-reports';
import { professionalExpenses } from './en/professional-expenses';
import { employerDashboard } from './en/employer-dashboard';
import { employees } from './en/employees';
import { leaveApprovals } from './en/leave-approvals';
import { accountingFirm } from './en/accounting-firm';

export const en = {
  common,
  shell,
  auth,
  employeeDashboard,
  payslips,
  documents,
  personalInfo,
  leaves,
  overtime,
  expenseReports,
  professionalExpenses,
  employerDashboard,
  employees,
  leaveApprovals,
  accountingFirm,
  loading: 'Loading…',
  settings: {
    title: 'Settings',
    name: 'Name',
    saveName: 'Save name',
    nonWorkingWeekdays: 'Usual non-working days',
    saveWeekdays: 'Save days',
    publicHolidays: 'Public holidays',
    addHoliday: 'Add',
    addHolidayTitle: 'Add a public holiday',
    noPublicHolidays: 'No public holiday retained.',
    removeHoliday: 'Remove',
    date: 'Date',
    label: 'Label',
  },
  days: {
    SUNDAY: 'Sunday',
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
  },
  errors: {
    [ErrorCode.ACCESS_DENIED]: 'You do not have access to this item.',
    [ErrorCode.REQUIRED_INFORMATION]: 'Fill in the required information.',
    [ErrorCode.POTENTIAL_DUPLICATE]: 'A similar item already exists.',
    [ErrorCode.INVALID_INFORMATION]:
      'A piece of information is invalid or longer than allowed.',
    [ErrorCode.FILE_TOO_LARGE]: 'This file is larger than the maximum size allowed.',
    [ErrorCode.UNSUPPORTED_FILE_FORMAT]:
      'This file is not accepted: its content must be a PDF, a JPG or PNG image, or an XLS, XLSX or CSV spreadsheet.',
    [ErrorCode.ALREADY_PROCESSED]:
      'This item is already being handled: it can no longer be changed.',
  },
} as const;
