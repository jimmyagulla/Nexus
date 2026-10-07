import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { en } from '../../infrastructure/ui/i18n/en';
import { fr } from '../../infrastructure/ui/i18n/fr';
import { I18n, i18n } from '../../infrastructure/ui/i18n/i18n';
import { ErrorPresenter } from './error.presenter';

const presenter = new ErrorPresenter();

describe('ErrorPresenter', () => {
  it('maps ACCESS_DENIED to the french phrase', () => {
    expect(presenter.present(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('maps a bare error code to the french phrase', () => {
    expect(presenter.present(ErrorCode.REQUIRED_INFORMATION)).toBe(
      i18n.messages.errors.REQUIRED_INFORMATION,
    );
  });

  it('falls back on an unknown error message', () => {
    expect(presenter.present(new Error('boom'))).toBe(i18n.messages.errors.ACCESS_DENIED);
  });

  it('falls back on a value that is not an error', () => {
    expect(presenter.present(undefined)).toBe(i18n.messages.errors.ACCESS_DENIED);
  });

  it('translates with the language of its i18n instance', () => {
    const english = new ErrorPresenter(new I18n({ fr, en }, 'en'));

    expect(english.present(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      en.errors.ACCESS_DENIED,
    );
  });
});
