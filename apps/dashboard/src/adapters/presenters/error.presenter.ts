import { ErrorCode, isErrorCode } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../infrastructure/ui/i18n/i18n';

export class ErrorPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(error: unknown): string {
    if (error instanceof Error) {
      return this.translate(error.message);
    }
    if (typeof error === 'string') {
      return this.translate(error);
    }

    return this.fallback();
  }

  private translate(message: string): string {
    return isErrorCode(message)
      ? this.i18n.messages.errors[message]
      : this.fallback();
  }

  private fallback(): string {
    return this.i18n.messages.errors[ErrorCode.ACCESS_DENIED];
  }
}
