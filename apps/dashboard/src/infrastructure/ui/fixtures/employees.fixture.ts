import type { EmployeeAttendanceViewModel, EmployeeHeaderModel, EmployeeViewModel, EmployeesViewModel } from '../../../adapters/presenters/employees/employees.view-models';

/** Placeholder data of the employees screens (mockup v3, flow 8). */
export const employeesFixture: EmployeesViewModel = {
  summary: '12 salariés · 11 actifs',
  resultsSummary: '4 résultats sur 12 ·',
  serviceFilter: 'Technique',
  employees: [
    {
      id: 'sarah-lefevre',
      initials: 'SL',
      name: 'Sarah Lefèvre',
      position: 'Développeuse',
      service: 'Technique',
      status: { label: 'Actif', tone: 'success' },
      startDate: '03/01/2023',
      lastActivity: 'Hier, 11:05',
    },
    {
      id: 'thomas-petit',
      initials: 'TP',
      name: 'Thomas Petit',
      position: 'Chef de projet',
      service: 'Technique',
      status: { label: 'Actif', tone: 'success' },
      startDate: '17/06/2020',
      lastActivity: '30/09/2026',
    },
    {
      id: 'lucas-garnier',
      initials: 'LG',
      name: 'Lucas Garnier',
      position: 'Technicien support',
      service: 'Technique',
      status: { label: "Période d'essai", tone: 'purple' },
      startDate: '01/09/2026',
      lastActivity: '29/09/2026',
    },
    {
      id: 'nathan-girard',
      initials: 'NG',
      name: 'Nathan Girard',
      position: 'Alternant développeur',
      service: 'Technique',
      status: { label: 'Actif', tone: 'success' },
      startDate: '02/09/2025',
      lastActivity: '28/09/2026',
    },
  ],
};

const camilleMartin: EmployeeHeaderModel = {
  id: 'camille-martin',
  initials: 'CM',
  name: 'Camille Martin',
  status: { label: 'Actif', tone: 'success' },
  meta: 'Chargée de clientèle · Commercial · CDI depuis le 02/03/2021 · Matricule 00042',
};

export const employeeFixture: EmployeeViewModel = {
  employee: camilleMartin,
  summary: [
    {
      icon: 'ri-folder-shield-2-line',
      label: 'Documents',
      value: '7',
      hint: '2 non consultés',
    },
    {
      icon: 'ri-file-paper-2-line',
      label: 'Bulletins de salaire',
      value: '67',
      hint: 'Septembre 2026 consulté',
    },
    {
      icon: 'ri-calendar-check-line',
      label: 'Présences',
      value: '20 j',
      hint: 'Travaillés en septembre',
    },
    {
      icon: 'ri-receipt-line',
      label: 'Frais professionnels',
      value: '1',
      hint: 'Demande à traiter',
    },
  ],
  identity: [
    { label: 'Nom', value: 'Martin' },
    { label: 'Prénom', value: 'Camille' },
    { label: 'Date de naissance', value: '18/05/1992' },
    { label: 'N° de sécurité sociale', value: '2 92 05 •• ••• ••• 41' },
    { label: 'Poste', value: 'Chargée de clientèle' },
    { label: 'Service', value: 'Commercial' },
    { label: 'Type de contrat', value: 'CDI — temps plein' },
    { label: "Date d'entrée", value: '02/03/2021' },
    { label: 'Coordonnées bancaires', value: 'FR76 •••• •••• •••• •••• •••• 189' },
  ],
  history: [
    {
      label: 'Consultation du bulletin de septembre 2026',
      date: "Aujourd'hui, 09:12",
    },
    {
      label: 'Bulletin de septembre 2026 mis à disposition',
      date: '01/10/2026',
    },
    { label: 'Note de frais envoyée — Train, 86,40 €', date: '28/09/2026' },
    { label: 'Avenant n°2 déposé par Nadia Roussel', date: '15/09/2026' },
  ],
};

export const employeeAttendanceFixture: EmployeeAttendanceViewModel = {
  employee: camilleMartin,
  periodFilter: '2026',
  months: [
    { month: 'Septembre 2026', period: '01/09 – 30/09', worked: '20', absences: '0', leaves: '2', sickLeaves: '0', otherEvents: '—' },
    { month: 'Août 2026', period: '01/08 – 31/08', worked: '11', absences: '0', leaves: '10', sickLeaves: '0', otherEvents: '—' },
    { month: 'Juillet 2026', period: '01/07 – 31/07', worked: '22', absences: '0', leaves: '0', sickLeaves: '0', otherEvents: '1 jour férié (14/07)' },
    { month: 'Juin 2026', period: '01/06 – 30/06', worked: '21', absences: '1', leaves: '0', sickLeaves: '0', otherEvents: 'Absence autorisée (12/06)' },
    { month: 'Mai 2026', period: '01/05 – 31/05', worked: '17', absences: '0', leaves: '0', sickLeaves: '0', otherEvents: '4 jours fériés' },
    { month: 'Avril 2026', period: '01/04 – 30/04', worked: '16', absences: '0', leaves: '5', sickLeaves: '0', otherEvents: '1 jour férié (06/04)' },
    { month: 'Mars 2026', period: '01/03 – 31/03', worked: '22', absences: '0', leaves: '0', sickLeaves: '0', otherEvents: '—' },
    { month: 'Février 2026', period: '01/02 – 28/02', worked: '16', absences: '0', leaves: '0', sickLeaves: '4', otherEvents: 'Arrêt maladie (03/02 – 06/02)' },
  ],
};
