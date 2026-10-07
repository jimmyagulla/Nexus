import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { ErrorPresenter } from './error.presenter';
import { fr } from '../../infrastructure/ui/i18n/fr';

const presenter = new ErrorPresenter();

describe('ErrorPresenter', () => {
  it('maps ACCESS_DENIED to the french phrase', () => {
    expect(presenter.present(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      fr.errors.ACCESS_DENIED,
    );
  });

  it('maps a bare error code to the french phrase', () => {
    expect(presenter.present(ErrorCode.REQUIRED_INFORMATION)).toBe(
      fr.errors.REQUIRED_INFORMATION,
    );
  });

  it('falls back on an unknown error message', () => {
    expect(presenter.present(new Error('boom'))).toBe(fr.errors.ACCESS_DENIED);
  });

  it('falls back on a value that is not an error', () => {
    expect(presenter.present(undefined)).toBe(fr.errors.ACCESS_DENIED);
  });
});
