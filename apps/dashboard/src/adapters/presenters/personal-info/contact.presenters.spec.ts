import { describe, expect, it } from 'vitest';
import { ConfirmChangesPresenter } from './confirm-changes.presenter';
import { ContactFieldsPresenter } from './contact-fields.presenter';
import { EditableInfoPresenter } from './editable-info.presenter';

const contact = { address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' };

describe('EditableInfoPresenter', () => {
  it('presents the four contact details, in their display order', () => {
    expect(new EditableInfoPresenter().present(contact)).toEqual([
      { id: 'address', label: 'Adresse', value: '14 rue des Tilleuls' },
      { id: 'postalCodeAndCity', label: 'Code postal et ville', value: '34000 Montpellier' },
      { id: 'phone', label: 'Téléphone', value: '06 12 34 56 47' },
      { id: 'email', label: 'Adresse e-mail personnelle', value: 'camille.martin@mail.fr' },
    ]);
  });
});

describe('ContactFieldsPresenter', () => {
  it('presents the fields of the edition with their saved value and their input type', () => {
    expect(new ContactFieldsPresenter().present(contact).map(({ id, value, type }) => ({ id, value, type }))).toEqual([
      { id: 'address', value: '14 rue des Tilleuls', type: 'text' },
      { id: 'postalCodeAndCity', value: '34000 Montpellier', type: 'text' },
      { id: 'phone', value: '06 12 34 56 47', type: 'tel' },
      { id: 'email', value: 'camille.martin@mail.fr', type: 'email' },
    ]);
  });
});

describe('ConfirmChangesPresenter', () => {
  it('recaps the changed fields only, and where the confirmation goes', () => {
    const next = { ...contact, address: '8 avenue de Lodève ', email: 'camille@mail.fr' };

    expect(new ConfirmChangesPresenter().present(contact, next)).toEqual({
      changes: [
        { id: 'address', label: 'Adresse', previous: '14 rue des Tilleuls', next: '8 avenue de Lodève' },
        { id: 'email', label: 'Adresse e-mail personnelle', previous: 'camille.martin@mail.fr', next: 'camille@mail.fr' },
      ],
      emailNotice: 'Un e-mail de confirmation sera envoyé à camille@mail.fr et le service RH sera informé.',
    });
  });

  it('recaps nothing when nothing changed', () => {
    expect(new ConfirmChangesPresenter().present(contact, contact).changes).toEqual([]);
  });
});
