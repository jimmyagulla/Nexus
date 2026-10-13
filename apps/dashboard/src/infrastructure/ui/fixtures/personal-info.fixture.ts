import type { PersonalInfoViewModel } from '../views/personal-info/PersonalInfo';
import type { PersonalInfoEditViewModel } from '../views/personal-info/PersonalInfoEdit';
import type { PersonalInfoUpdatedViewModel } from '../views/personal-info/PersonalInfoUpdated';

/** Placeholder data of the personal information screens (mockup v3, flow 3). */
export const personalInfoFixture: PersonalInfoViewModel = {
  lastUpdate: 'Dernière mise à jour le 12/06/2026',
  contact: [
    { id: 'address', label: 'Adresse', value: '14 rue des Tilleuls' },
    { id: 'city', label: 'Code postal et ville', value: '34000 Montpellier' },
    { id: 'phone', label: 'Téléphone', value: '06 12 34 56 47' },
    { id: 'email', label: 'Adresse e-mail personnelle', value: 'camille.martin@mail.fr' },
  ],
  employer: [
    { id: 'last-name', label: 'Nom', value: 'Martin' },
    { id: 'first-name', label: 'Prénom', value: 'Camille' },
    { id: 'birth-date', label: 'Date de naissance', value: '18/05/1992' },
    { id: 'ssn', label: 'N° de sécurité sociale', value: '2 92 05 •• ••• ••• 41' },
    { id: 'job', label: 'Poste', value: 'Chargée de clientèle' },
    { id: 'department', label: 'Service', value: 'Commercial' },
    { id: 'contract', label: 'Type de contrat', value: 'CDI — temps plein' },
    { id: 'start-date', label: "Date d'entrée", value: '02/03/2021' },
    { id: 'bank', label: 'Coordonnées bancaires', value: 'FR76 •••• •••• •••• •••• •••• 189' },
  ],
};

export const personalInfoEditFixture: PersonalInfoEditViewModel = {
  fields: [
    { id: 'address', label: 'Adresse', value: '8 avenue de Lodève', modified: true },
    { id: 'city', label: 'Code postal et ville', value: '34070 Montpellier', modified: true },
    { id: 'phone', label: 'Téléphone', value: '06 12 34 56 47', type: 'tel' },
    {
      id: 'email',
      label: 'Adresse e-mail personnelle',
      value: 'camille.martin@mail.fr',
      type: 'email',
    },
  ],
  confirmation: {
    changes: [
      {
        id: 'address',
        label: 'Adresse',
        previous: '14 rue des Tilleuls',
        next: '8 avenue de Lodève',
      },
      {
        id: 'city',
        label: 'Code postal et ville',
        previous: '34000 Montpellier',
        next: '34070 Montpellier',
      },
    ],
    emailNotice:
      'Un e-mail de confirmation sera envoyé à camille.martin@mail.fr et le service RH sera informé.',
  },
};

export const personalInfoUpdatedFixture: PersonalInfoUpdatedViewModel = {
  notice:
    'Le service RH a été informé le 03/10/2026 à 10:41. Un e-mail de confirmation vous a été envoyé.',
  lastUpdate: 'Dernière mise à jour le 03/10/2026',
  contact: [
    { id: 'address', label: 'Adresse', value: '8 avenue de Lodève', modified: true },
    { id: 'city', label: 'Code postal et ville', value: '34070 Montpellier', modified: true },
    { id: 'phone', label: 'Téléphone', value: '06 12 34 56 47' },
    { id: 'email', label: 'Adresse e-mail personnelle', value: 'camille.martin@mail.fr' },
  ],
};
