import type { OvertimeDeclarationViewModel } from '../../../adapters/presenters/overtime/overtime-declaration.presenter';
import type { OvertimeViewModel } from '../../../adapters/presenters/overtime/overtime.presenter';

/** Placeholder data of the overtime screens (mockup v3, flow 5). */
export const overtimeFixture: OvertimeViewModel = {
  counters: {
    pending: '+8h30',
    approved: '+14h00',
    processed: '10h00',
  },
  declarations: [
    {
      date: '02/10/2026',
      hours: '+1h00',
      reason: 'Préparation rendez-vous client',
      proof: '—',
      status: { label: 'Brouillon', tone: 'draft' },
    },
    {
      date: '30/09/2026',
      hours: '+2h30',
      reason: 'Clôture dossier client Valette',
      proof: '1 fichier',
      status: { label: 'En attente de validation', tone: 'warning' },
    },
    {
      date: '26/09/2026',
      hours: '+3h00',
      reason: 'Salon professionnel Bordeaux',
      proof: '1 fichier',
      status: { label: 'En attente de validation', tone: 'warning' },
    },
    {
      date: '18/09/2026',
      hours: '+3h00',
      reason: 'Inventaire de fin de trimestre',
      proof: '—',
      status: { label: 'En attente de validation', tone: 'warning' },
    },
    {
      date: '28/08/2026',
      hours: '+4h00',
      reason: 'Mise en production client',
      proof: '—',
      status: { label: 'Validées', tone: 'success' },
    },
    {
      date: '12/07/2026',
      hours: '+2h00',
      reason: 'Formation équipe',
      proof: '—',
      status: { label: 'Traitées', tone: 'done' },
    },
    {
      date: '05/07/2026',
      hours: '+1h30',
      reason: 'Réunion hors horaires',
      proof: '—',
      status: { label: 'Refusées', tone: 'danger' },
    },
  ],
};

export const overtimeDeclarationFixture: OvertimeDeclarationViewModel = {
  form: {
    date: '02/10/2026',
    hours: '2 h 30',
    startTime: '18:00',
    endTime: '20:30',
    reason: 'Préparation du rendez-vous client Valette du 05/10.',
  },
  counter: {
    pending: '+8h30',
    thisDeclaration: '+2h30',
    pendingAfter: '+11h00',
  },
  validator: 'Nadia Roussel, service RH',
};
