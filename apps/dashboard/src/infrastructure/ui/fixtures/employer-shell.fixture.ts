import type { ShellViewModel } from '../../../adapters/presenters/shell/shell.view-models';
import { i18n } from '../i18n/i18n';
import { AppRoutes } from '../routes/app-routes';

const nav = i18n.messages.shell.employerNav;

/** Placeholder data of the employer shell, until a presenter provides it. */
export const employerShellFixture: ShellViewModel = {
  role: 'employer',
  companyName: 'Atelier Moreau',
  user: {
    initials: 'NR',
    name: 'Nadia Roussel',
    lastLogin: 'Dernière connexion 08:47',
  },
  sections: [
    {
      title: nav.steering,
      items: [
        { label: nav.dashboard, to: AppRoutes.employer, icon: 'ri-dashboard-line', exact: true },
        { label: nav.employees, to: AppRoutes.employees, icon: 'ri-team-line' },
        { label: nav.staffRegister, to: AppRoutes.staffRegister, icon: 'ri-book-2-line' },
      ],
    },
    {
      title: nav.hr,
      items: [
        { label: nav.documents, to: AppRoutes.employerDocuments, icon: 'ri-folder-shield-2-line', badge: '8' },
        { label: nav.payslips, to: AppRoutes.employerPayslips, icon: 'ri-file-paper-2-line' },
        { label: nav.attendance, to: AppRoutes.employerAttendance, icon: 'ri-calendar-check-line' },
        { label: nav.leaves, to: AppRoutes.leaveApprovals, icon: 'ri-sun-line', badge: '4' },
        { label: nav.overtime, to: AppRoutes.employerOvertime, icon: 'ri-time-line', badge: '2' },
      ],
    },
    {
      title: nav.expenses,
      items: [
        { label: nav.expenseReports, to: AppRoutes.employerExpenseReports, icon: 'ri-receipt-line', badge: '5' },
        { label: nav.professionalExpenses, to: AppRoutes.employerProfessionalExpenses, icon: 'ri-briefcase-4-line', badge: '1' },
      ],
    },
    {
      title: nav.partners,
      items: [
        { label: nav.accountingFirm, to: AppRoutes.accountingFirm, icon: 'ri-building-4-line', badge: '3' },
      ],
    },
    {
      title: nav.administration,
      items: [
        { label: nav.usersAndAccess, to: AppRoutes.usersAndAccess, icon: 'ri-shield-user-line' },
        { label: nav.settings, to: AppRoutes.settings, icon: 'ri-settings-3-line' },
        { label: nav.activityLog, to: AppRoutes.activityLog, icon: 'ri-history-line' },
      ],
    },
  ],
  mobileTabs: [],
  searchPlaceholder: i18n.messages.shell.employerSearchPlaceholder,
  hasUnreadNotifications: true,
  switchTo: { label: i18n.messages.shell.employeeView, to: AppRoutes.home },
};
