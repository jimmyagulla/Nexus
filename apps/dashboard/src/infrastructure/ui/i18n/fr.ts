import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { common } from './fr/common';
import { shell } from './fr/shell';
import { auth } from './fr/auth';
import { employeeDashboard } from './fr/employee-dashboard';
import { payslips } from './fr/payslips';
import { documents } from './fr/documents';
import { personalInfo } from './fr/personal-info';
import { leaves } from './fr/leaves';
import { overtime } from './fr/overtime';
import { expenseReports } from './fr/expense-reports';
import { professionalExpenses } from './fr/professional-expenses';
import { employerDashboard } from './fr/employer-dashboard';
import { employees } from './fr/employees';
import { leaveApprovals } from './fr/leave-approvals';
import { accountingFirm } from './fr/accounting-firm';

export const fr = {
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
  loading: 'Chargement…',
  settings: {
    title: 'Paramètres',
    name: 'Nom',
    saveName: 'Enregistrer le nom',
    nonWorkingWeekdays: 'Jours habituels non travaillés',
    saveWeekdays: 'Enregistrer les jours',
    publicHolidays: 'Jours fériés',
    addHoliday: 'Ajouter',
    addHolidayTitle: 'Ajouter un jour férié',
    noPublicHolidays: 'Aucun jour férié retenu.',
    removeHoliday: 'Retirer',
    date: 'Date',
    label: 'Libellé',
  },
  days: {
    SUNDAY: 'Dimanche',
    MONDAY: 'Lundi',
    TUESDAY: 'Mardi',
    WEDNESDAY: 'Mercredi',
    THURSDAY: 'Jeudi',
    FRIDAY: 'Vendredi',
    SATURDAY: 'Samedi',
  },
  errors: {
    [ErrorCode.ACCESS_DENIED]: "Vous n'avez pas accès à cet élément.",
    [ErrorCode.REQUIRED_INFORMATION]:
      'Renseignez les informations obligatoires.',
    [ErrorCode.POTENTIAL_DUPLICATE]: 'Un élément semblable existe déjà.',
  },
} as const;
