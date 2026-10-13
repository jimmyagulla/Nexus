import type { DocumentSentViewModel } from '../../../adapters/presenters/documents/document-sent.presenter';
import type { DocumentTypeOptionModel, DocumentUploadViewModel } from '../../../adapters/presenters/documents/document-upload.presenter';
import type { DocumentsViewModel } from '../../../adapters/presenters/documents/documents.presenter';

/** Placeholder data of the documents screens (mockup v3, flow 2). */
export const documentsFixture: DocumentsViewModel = {
  appliedFilterCount: 2,
  resultSummary: '2 résultats sur 7 ·',
  activeFilters: [
    { label: 'Catégorie', value: 'Avenants, Mutuelle' },
    { label: 'Statut', value: 'Nouveau' },
  ],
  filters: {
    appliedLabel: '2 filtres appliqués',
    showResultsLabel: 'Afficher 2 résultats',
    categories: [
      { id: 'contract', label: 'Contrat de travail', count: 1, checked: false },
      { id: 'amendment', label: 'Avenants', count: 2, checked: true },
      { id: 'health', label: 'Mutuelle', count: 1, checked: true },
      { id: 'administrative', label: 'Documents administratifs', count: 1, checked: false },
      { id: 'sick-leave', label: 'Arrêts maladie', count: 1, checked: false },
      { id: 'other', label: 'Autres documents', count: 1, checked: false },
    ],
    statuses: [
      { id: 'new', label: 'Nouveau', count: 2, checked: true },
      { id: 'seen', label: 'Consulté', count: 4, checked: false },
      { id: 'processed', label: 'Pris en compte', count: 1, checked: false },
      { id: 'pending', label: 'En attente de prise en compte', count: 0, checked: false },
    ],
    emitters: [
      { value: 'all', label: 'Tous' },
      { value: 'hr', label: 'Service RH' },
      { value: 'me', label: 'Vous' },
    ],
    emitter: 'all',
  },
  documents: [
    {
      id: 'amendment-2',
      icon: 'ri-file-text-line',
      name: 'Avenant n°2 — Temps de travail',
      category: 'Avenants',
      date: '15/09/2026',
      format: 'PDF',
      size: '188 Ko',
      emitter: 'Service RH',
      status: { label: 'Nouveau', tone: 'info' },
    },
    {
      id: 'health-2026',
      icon: 'ri-heart-pulse-line',
      name: 'Notice mutuelle 2026',
      category: 'Mutuelle',
      date: '05/01/2026',
      format: 'PDF',
      size: '1,4 Mo',
      emitter: 'Service RH',
      status: { label: 'Nouveau', tone: 'info' },
    },
  ],
};

const documentTypes: DocumentTypeOptionModel[] = [
  {
    value: 'sick-leave',
    icon: 'ri-first-aid-kit-line',
    label: 'Arrêt maladie',
    shortLabel: 'Arrêt maladie',
    description: "Avis d'arrêt de travail, prolongation",
  },
  {
    value: 'proof',
    icon: 'ri-file-check-line',
    label: 'Justificatif',
    shortLabel: 'Justificatif',
    description: 'Domicile, transport, formation',
  },
  {
    value: 'administrative',
    icon: 'ri-file-text-line',
    label: 'Document administratif',
    shortLabel: 'Administratif',
    description: 'Attestation, certificat',
  },
  {
    value: 'other',
    icon: 'ri-file-line',
    label: 'Autre',
    shortLabel: 'Autre',
    description: 'Tout autre document RH',
  },
];

export const documentUploadFixture: DocumentUploadViewModel = {
  form: {
    types: documentTypes,
    selectedType: 'sick-leave',
    note: "Transmettez le volet 3 de votre avis d'arrêt de travail dans les 48 heures suivant sa date de prescription.",
    file: { name: 'arret_travail_2026-10-02.pdf', details: '1,2 Mo · Importé' },
    comment: 'Arrêt prescrit du 02/10 au 09/10/2026.',
  },
  mobileForm: {
    types: documentTypes,
    selectedType: 'sick-leave',
    note: "Transmettez le volet 3 de votre avis d'arrêt dans les 48 heures.",
    file: { name: 'IMG_2041.jpg', details: '2,4 Mo · Importé' },
  },
};

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
