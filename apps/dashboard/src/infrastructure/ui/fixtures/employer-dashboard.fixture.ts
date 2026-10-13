import { AppRoutes } from '../routes/app-routes';
import type { EmployerDashboardViewModel } from '../views/employer-dashboard/EmployerDashboard';

/** Placeholder data of the employer dashboard (mockup v3, flow 8). */
export const employerDashboardFixture: EmployerDashboardViewModel = {
  greeting: 'Bonjour Nadia',
  summary: '17 actions à traiter · Atelier Moreau au 3 octobre 2026',
  stats: [
    { value: '12', label: 'Salariés', hint: "1 en période d'essai" },
    { value: '8', label: 'Documents non consultés', hint: 'Par les salariés' },
    { value: '2', label: 'Documents salariés', hint: 'Déposés depuis hier' },
    { value: '3', label: "Absents aujourd'hui", hint: '2 congés · 1 arrêt' },
  ],
  taskCount: '17',
  tasks: [
    {
      icon: 'ri-sun-line',
      tone: 'green',
      count: '4',
      label: 'demandes de congés',
      hint: 'Plus ancienne : 29/09/2026',
      to: AppRoutes.leaveApprovals,
    },
    {
      icon: 'ri-time-line',
      tone: 'purple',
      count: '2',
      label: "déclarations d'heures supplémentaires",
      hint: '+5h30 au total',
      to: AppRoutes.employerOvertime,
    },
    {
      icon: 'ri-receipt-line',
      tone: 'amber',
      count: '5',
      label: 'notes de frais',
      hint: '486,30 € à valider',
      to: AppRoutes.employerExpenseReports,
    },
    {
      icon: 'ri-briefcase-4-line',
      tone: 'orange',
      count: '1',
      label: 'frais professionnel',
      hint: 'Forfait télétravail · Camille Martin',
      to: AppRoutes.employerProfessionalExpenses,
    },
    {
      icon: 'ri-upload-2-line',
      tone: 'dark',
      count: '3',
      label: 'documents pour le cabinet comptable',
      hint: 'À transmettre avant le 05/10/2026',
      to: AppRoutes.accountingFirm,
    },
    {
      icon: 'ri-download-2-line',
      tone: 'dark',
      count: '2',
      label: 'documents reçus du cabinet comptable',
      hint: 'Dont 1 nouveau',
      to: AppRoutes.accountingFirm,
    },
  ],
  activities: [
    {
      icon: 'ri-eye-line',
      actor: 'Camille Martin',
      action: 'a consulté le bulletin de septembre 2026',
      date: "Aujourd'hui, 09:12",
    },
    {
      icon: 'ri-upload-2-line',
      actor: 'Hugo Fontaine',
      action: 'a déposé un arrêt maladie',
      date: 'Hier, 17:30',
    },
    {
      icon: 'ri-file-paper-2-line',
      actor: 'Nadia Roussel',
      action: 'a publié 12 bulletins — septembre 2026',
      date: '01/10/2026',
    },
    {
      icon: 'ri-shield-user-line',
      actor: 'Nadia Roussel',
      action: 'a modifié les droits de Thomas Petit',
      date: '30/09/2026',
    },
    {
      icon: 'ri-receipt-line',
      actor: 'Sarah Lefèvre',
      action: 'a envoyé une note de frais — 112,00 €',
      date: '29/09/2026',
    },
  ],
};
