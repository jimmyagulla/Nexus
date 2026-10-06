import { ErrorCode, isErrorCode } from '@hexagonal-monorepo-template/domain';
import { fr } from '../../infrastructure/ui/i18n/fr';

export class ErrorPresenter {
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
    return isErrorCode(message) ? fr.errors[message] : this.fallback();
  }

  private fallback(): string {
    return fr.errors[ErrorCode.ACCESS_DENIED];
  }
}
