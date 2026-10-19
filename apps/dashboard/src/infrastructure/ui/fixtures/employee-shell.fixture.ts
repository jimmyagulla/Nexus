import type { ShellViewModel } from '../../../adapters/presenters/shell/shell.presenter';
import { i18n } from '../i18n/i18n';
import { AppRoutes } from '../routes/app-routes';

const nav = i18n.messages.shell.employeeNav;
const tabs = i18n.messages.shell.mobileNav;

/** Placeholder data of the employee shell, until a presenter provides it. */
export const employeeShellFixture: ShellViewModel = {
  role: 'employee',
  companyName: 'Atelier Moreau',
  user: {
    initials: 'CM',
    name: 'Camille Martin',
    lastLogin: 'Dernière connexion 09:12',
  },
  sections: [
    {
      title: nav.mySpace,
      items: [
        { label: nav.dashboard, to: AppRoutes.home, icon: 'ri-home-5-line', exact: true },
      ],
    },
    {
      title: nav.myDocuments,
      items: [
        { label: nav.documents, to: AppRoutes.documents, icon: 'ri-folder-shield-2-line', badge: '3' },
        { label: nav.payslips, to: AppRoutes.payslips, icon: 'ri-file-paper-2-line', counter: 'unseenPayslips' },
        { label: nav.documentsToSend, to: AppRoutes.documentsToSend, icon: 'ri-upload-cloud-2-line' },
      ],
    },
    {
      title: nav.myTime,
      items: [
        { label: nav.leaves, to: AppRoutes.leaves, icon: 'ri-sun-line' },
        { label: nav.overtime, to: AppRoutes.overtime, icon: 'ri-time-line' },
        { label: nav.attendance, to: AppRoutes.attendance, icon: 'ri-calendar-check-line' },
      ],
    },
    {
      title: nav.myExpenses,
      items: [
        { label: nav.expenseReports, to: AppRoutes.expenseReports, icon: 'ri-receipt-line' },
        { label: nav.professionalExpenses, to: AppRoutes.professionalExpenses, icon: 'ri-briefcase-4-line', badge: '1' },
      ],
    },
    {
      title: nav.myInformation,
      items: [
        { label: nav.personalInfo, to: AppRoutes.personalInfo, icon: 'ri-user-settings-line' },
      ],
    },
  ],
  mobileTabs: [
    { label: tabs.home, to: AppRoutes.home, icon: 'ri-home-5-line', activeIcon: 'ri-home-5-fill', exact: true },
    { label: tabs.documents, to: AppRoutes.documents, icon: 'ri-folder-shield-2-line', activeIcon: 'ri-folder-shield-2-fill' },
    { label: tabs.payslips, to: AppRoutes.payslips, icon: 'ri-file-paper-2-line', activeIcon: 'ri-file-paper-2-fill' },
    { label: tabs.profile, to: AppRoutes.personalInfo, icon: 'ri-user-line', activeIcon: 'ri-user-fill' },
  ],
  searchPlaceholder: i18n.messages.shell.employeeSearchPlaceholder,
  searchPreview: {
    query: 'bulletin mars',
    interpretation: ['Bulletins de salaire', 'Mois : mars', 'Toutes années'],
    groupLabel: 'Bulletins de salaire',
    results: [
      { title: 'Mars 2026', subtitle: 'Mis à disposition le 31/03/2026 · Consulté' },
      { title: 'Mars 2025', subtitle: 'Mis à disposition le 31/03/2025 · Consulté' },
      { title: 'Mars 2024', subtitle: 'Mis à disposition le 29/03/2024 · Consulté' },
    ],
    action: 'Télécharger les 6 bulletins de mars (ZIP)',
  },
  hasUnreadNotifications: true,
  switchTo: { label: i18n.messages.shell.employerView, to: AppRoutes.employer },
};
