import { describe, expect, it } from 'vitest';
import { en } from './en';
import { fr } from './fr';
import { I18n, type Messages } from './i18n';

describe('I18n', () => {
  it('translates with the french catalog when no language is chosen', () => {
    const i18n = new I18n({ fr });

    expect(i18n.messages.settings.title).toBe(fr.settings.title);
    expect(i18n.messages.days.SUNDAY).toBe(fr.days.SUNDAY);
    expect(i18n.messages.errors.ACCESS_DENIED).toBe(fr.errors.ACCESS_DENIED);
  });

  it('translates with the catalog of the chosen language', () => {
    const en: Messages = {
      ...fr,
      loading: 'Loading…',
    };
    const i18n = new I18n({ fr, en }, 'en');

    expect(i18n.messages.loading).toBe('Loading…');
  });

  it('uses the language of a regional locale', () => {
    const en: Messages = {
      ...fr,
      loading: 'Loading…',
    };
    const i18n = new I18n({ fr, en }, 'en-US');

    expect(i18n.messages.loading).toBe('Loading…');
  });

  it('falls back to french when the language has no catalog', () => {
    const en: Messages = {
      ...fr,
      loading: 'Loading…',
    };
    const i18n = new I18n({ fr, en }, 'de');

    expect(i18n.messages.loading).toBe(fr.loading);
  });

  it('selects the english catalog the same way as french', () => {
    const i18n = new I18n({ fr, en }, 'en');

    expect(i18n.messages.settings.title).toBe(en.settings.title);
    expect(i18n.messages.days.MONDAY).toBe(en.days.MONDAY);
    expect(i18n.messages.errors.ACCESS_DENIED).toBe(en.errors.ACCESS_DENIED);
    expect(en.settings.title).not.toBe(fr.settings.title);
  });

  it('words the cabinet refusals as the product reference does', () => {
    expect(fr.errors.INVALID_FILE).toBe(
      'Ce fichier ne peut pas être accepté. Vérifiez son format et réessayez.',
    );
    expect(fr.errors.MISSING_DOCUMENT).toBe(
      'Ajoutez le document attendu avant de valider.',
    );
    expect(fr.errors.TRANSMISSION_FAILED).toBe(
      "La transmission n'a pas abouti. Vous pouvez réessayer.",
    );
    expect(fr.errors.INACCESSIBLE_DOCUMENT).toBe(
      "Ce document n'est pas accessible.",
    );
    expect(fr.errors.REQUEST_ALREADY_PROCESSED).toBe(
      'Cette demande a déjà été traitée.',
    );
  });

  it('confirms a transmission as the product reference does', () => {
    expect(fr.cabinet.transmitted).toBe(
      'Le document a été transmis au cabinet comptable.',
    );
  });

  it('names the exchange statuses as the product reference does', () => {
    expect(Object.values(fr.cabinet.statuses)).toEqual([
      'Brouillon',
      'À transmettre',
      'Transmis',
      'Reçu',
      'Consulté',
    ]);
  });
});
