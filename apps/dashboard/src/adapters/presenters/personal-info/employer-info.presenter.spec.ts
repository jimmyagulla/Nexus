import { describe, expect, it } from 'vitest';
import { EmployerInfoPresenter } from './employer-info.presenter';

const employment = {
  lastName: 'Martin', firstName: 'Camille', birthDate: '1992-05-18', socialSecurityNumber: '2 92 05 •• ••• ••• 41',
  jobTitle: 'Chargée de clientèle', department: 'Commercial', contractType: 'PERMANENT', workingTime: 'FULL_TIME',
  startDate: '2021-03-02', iban: 'FR76 •••• •••• •••• •••• •••• 189',
} as const;

describe('EmployerInfoPresenter', () => {
  it('presents what the employer records, in the order of the card', () => {
    expect(new EmployerInfoPresenter().present(employment)).toEqual([
      { id: 'last-name', label: 'Nom', value: 'Martin' },
      { id: 'first-name', label: 'Prénom', value: 'Camille' },
      { id: 'birth-date', label: 'Date de naissance', value: '18/05/1992' },
      { id: 'ssn', label: 'N° de sécurité sociale', value: '2 92 05 •• ••• ••• 41' },
      { id: 'job', label: 'Poste', value: 'Chargée de clientèle' },
      { id: 'department', label: 'Service', value: 'Commercial' },
      { id: 'contract', label: 'Type de contrat', value: 'CDI — temps plein' },
      { id: 'start-date', label: "Date d'entrée", value: '02/03/2021' },
      { id: 'bank', label: 'Coordonnées bancaires', value: 'FR76 •••• •••• •••• •••• •••• 189' },
    ]);
  });

  it('names a part-time fixed-term contract', () => {
    const rows = new EmployerInfoPresenter().present({ ...employment, contractType: 'FIXED_TERM', workingTime: 'PART_TIME' });

    expect(rows.find((row) => row.id === 'contract')?.value).toBe('CDD — temps partiel');
  });
});
