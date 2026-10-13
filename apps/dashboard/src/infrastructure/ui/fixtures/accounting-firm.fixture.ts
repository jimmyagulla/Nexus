import type { AccountingFirmUploadFormModel, AccountingFirmUploadViewModel } from '../../../adapters/presenters/accounting-firm/accounting-firm-upload.presenter';
import type { AccountingFirmViewModel, ExchangeRowModel } from '../../../adapters/presenters/accounting-firm/accounting-firm.presenter';

/** Placeholder data of the accounting firm screens (mockup v3, flow 10). */
const exchanges: ExchangeRowModel[] = [
  {
    id: 'ex-1',
    icon: 'ri-file-chart-line',
    name: 'Bilan provisoire T3',
    category: 'Document comptable',
    date: '29/09/2026',
    direction: 'fromFirm',
    status: { label: 'Nouveau', tone: 'info' },
  },
  {
    id: 'ex-2',
    icon: 'ri-file-paper-2-line',
    name: 'Éléments de paie septembre',
    category: 'Éléments de paie',
    date: '30/09/2026',
    direction: 'toFirm',
    status: { label: 'Transmis', tone: 'success' },
  },
  {
    id: 'ex-3',
    icon: 'ri-receipt-line',
    name: 'Justificatifs notes de frais septembre',
    category: 'Pièces comptables',
    date: '03/10/2026',
    direction: 'toFirm',
    status: { label: 'À transmettre', tone: 'alert' },
  },
  {
    id: 'ex-4',
    icon: 'ri-heart-pulse-line',
    name: 'Attestations mutuelle 2026',
    category: 'Documents sociaux',
    date: '02/10/2026',
    direction: 'toFirm',
    status: { label: 'À transmettre', tone: 'alert' },
  },
  {
    id: 'ex-5',
    icon: 'ri-file-text-line',
    name: 'Variables de paie octobre',
    category: 'Éléments de paie',
    date: '—',
    direction: 'toFirm',
    status: { label: 'Brouillon', tone: 'draft' },
  },
  {
    id: 'ex-6',
    icon: 'ri-bill-line',
    name: 'Facture honoraires septembre',
    category: 'Facture',
    date: '05/09/2026',
    direction: 'fromFirm',
    status: { label: 'Reçu', tone: 'submitted' },
  },
  {
    id: 'ex-7',
    icon: 'ri-file-shield-2-line',
    name: 'DSN août 2026 — accusé',
    category: 'Déclaration sociale',
    date: '15/09/2026',
    direction: 'fromFirm',
    status: { label: 'Consulté', tone: 'neutral' },
  },
];

export const accountingFirmFixture: AccountingFirmViewModel = {
  firm: {
    name: 'Fiducia Conseil — expertise comptable',
    contact:
      'Contact : Marc Delorme · m.delorme@fiducia-conseil.fr · connecté depuis le 12/01/2026',
  },
  all: exchanges,
  sent: exchanges.filter((exchange) => exchange.direction === 'toFirm'),
  received: exchanges.filter((exchange) => exchange.direction === 'fromFirm'),
  counts: { all: '7', sent: '4', received: '3' },
};

const uploadForm: AccountingFirmUploadFormModel = {
  documentTypes: [
    'Pièces comptables',
    'Éléments de paie',
    'Documents sociaux',
    'Document comptable',
  ],
  documentType: 'Pièces comptables',
  recipients: ['Marc Delorme — Fiducia Conseil'],
  recipient: 'Marc Delorme — Fiducia Conseil',
  files: [
    {
      icon: 'ri-file-zip-line',
      name: 'justificatifs_ndf_septembre_2026.zip',
      details: '4,8 Mo · 14 fichiers',
    },
    {
      icon: 'ri-file-excel-2-line',
      name: 'recapitulatif_ndf_septembre.xlsx',
      details: '38 Ko',
    },
  ],
  transmission: 'scheduled',
  transmissionDate: '05/10/2026',
  comment: 'Justificatifs validés au 03/10.',
};

export const accountingFirmUploadFixture: AccountingFirmUploadViewModel = {
  firmName: 'Fiducia Conseil',
  form: uploadForm,
};
