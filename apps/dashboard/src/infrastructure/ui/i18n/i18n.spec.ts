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
});
