import { AppRoutes } from '../routes/app-routes';
import type { EmployeeDashboardViewModel } from '../../../adapters/presenters/employee-dashboard/employee-dashboard.view-models';

const latestPayslip = {
  to: AppRoutes.payslip,
  params: { payslipId: '2026-09' },
} as const;

/** Placeholder data of the employee dashboard (mockup v3, P1.3 and M.1). */
export const employeeDashboardFixture: EmployeeDashboardViewModel = {
  firstName: 'Camille',
  lastLogin: '2 octobre 2026 à 18:04',
  leaveBalance: {
    available: '18 j',
    period: '2026–2027',
    ring: { takenUntil: 28, pendingUntil: 36 },
    items: [
      { kind: 'acquired', label: 'Acquis', value: '25 j' },
      { kind: 'taken', label: 'Pris', value: '7 j' },
      { kind: 'pending', label: 'En attente', value: '2 j' },
      { kind: 'remaining', label: 'Solde après validation', value: '16 j' },
    ],
    nextLeave: {
      dates: '29/10 – 30/10/2026',
      status: { label: 'En attente', tone: 'warning' },
    },
  },
  flows: [
    {
      id: 'documents',
      icon: 'ri-folder-shield-2-line',
      tone: 'blue',
      label: 'Documents',
      value: '3 nouveaux documents',
      action: 'Voir',
      link: { to: AppRoutes.documents },
    },
    {
      id: 'payslip',
      icon: 'ri-file-paper-2-line',
      tone: 'blue',
      label: 'Bulletin de salaire',
      value: 'Septembre 2026 · disponible',
      action: 'Consulter',
      link: latestPayslip,
    },
    {
      id: 'overtime',
      icon: 'ri-time-line',
      tone: 'purple',
      label: 'Heures supplémentaires',
      value: '+8h30 en attente',
      action: 'Voir le détail',
      link: { to: AppRoutes.overtime },
    },
    {
      id: 'expense-reports',
      icon: 'ri-receipt-line',
      tone: 'amber',
      label: 'Notes de frais',
      value: '2 demandes en cours',
      action: 'Suivre',
      link: { to: AppRoutes.expenseReports },
    },
    {
      id: 'professional-expenses',
      icon: 'ri-briefcase-4-line',
      tone: 'orange',
      label: 'Frais professionnels',
      value: '1 demande à compléter',
      action: 'Compléter',
      link: { to: AppRoutes.professionalExpenses },
    },
  ],
  activities: [
    {
      id: 'payslip-added',
      icon: 'ri-file-paper-2-line',
      tone: 'blue',
      title: 'Bulletin de salaire ajouté',
      detail: 'Septembre 2026 · 01/10/2026',
      status: { label: 'Nouveau', tone: 'info' },
    },
    {
      id: 'leave-request-sent',
      icon: 'ri-sun-line',
      tone: 'green',
      title: 'Demande de congé envoyée',
      detail: 'Du 29/10 au 30/10/2026 · 2 jours',
      status: { label: 'En attente', tone: 'warning' },
    },
    {
      id: 'expense-report-submitted',
      icon: 'ri-receipt-line',
      tone: 'amber',
      title: 'Note de frais soumise',
      detail: 'Salon Bordeaux · 112,00 €',
      status: { label: 'En cours de validation', tone: 'warning' },
    },
    {
      id: 'document-sent',
      icon: 'ri-upload-2-line',
      tone: 'blue',
      title: "Document transmis à l'employeur",
      detail: 'Justificatif de domicile · 28/09/2026',
      status: { label: 'Pris en compte', tone: 'success' },
    },
  ],
  mobile: {
    payslipBanner: {
      title: 'Bulletin de septembre 2026',
      subtitle: 'Nouveau · disponible',
      link: latestPayslip,
    },
    flows: [
      {
        id: 'leaves',
        icon: 'ri-sun-line',
        title: 'Mes congés',
        detail: '18 jours disponibles',
        link: { to: AppRoutes.leaves },
      },
      {
        id: 'documents',
        icon: 'ri-folder-shield-2-line',
        title: 'Documents',
        detail: '3 nouveaux',
        link: { to: AppRoutes.documents },
      },
      {
        id: 'overtime',
        icon: 'ri-time-line',
        title: 'Heures supplémentaires',
        detail: '+8h30 en attente',
        link: { to: AppRoutes.overtime },
      },
      {
        id: 'expense-reports',
        icon: 'ri-receipt-line',
        title: 'Notes de frais',
        detail: '2 en cours',
        link: { to: AppRoutes.expenseReports },
      },
      {
        id: 'professional-expenses',
        icon: 'ri-briefcase-4-line',
        title: 'Frais professionnels',
        detail: '1 à compléter',
        link: { to: AppRoutes.professionalExpenses },
      },
    ],
  },
};
