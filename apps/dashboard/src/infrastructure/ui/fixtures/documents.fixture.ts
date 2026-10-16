import type { DocumentSentViewModel } from '../../../adapters/presenters/documents/document-sent.presenter';

/** Placeholder data of the document sent confirmation (mockup v3, flow 2). */
export const documentSentFixture: DocumentSentViewModel = {
  description:
    'Votre arrêt maladie a été transmis au service RH. Vous serez notifié par e-mail dès sa prise en compte.',
  type: 'Arrêt maladie',
  fileName: 'arret_travail_2026-10-02.pdf',
  sentAt: '03/10/2026 à 10:24',
  recipient: 'Service RH — Atelier Moreau',
  status: { label: 'En attente de prise en compte', tone: 'warning' },
  steps: [
    { label: 'Transmis', state: 'done' },
    { label: 'Prise en compte RH', state: 'current' },
    { label: 'Classé dans votre coffre', state: 'upcoming' },
  ],
};
