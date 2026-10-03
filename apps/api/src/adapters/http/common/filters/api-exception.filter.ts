import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ErrorMessage } from '@hexagonal-monorepo-template/domain';
import { buildErrorEnvelope, extractErrorMessage } from '../dto/api-response.mapper';

const STATUS_BY_DOMAIN_MESSAGE: Readonly<Record<string, number>> = {
  [ErrorMessage.NON_AUTORISE]: 403,
  [ErrorMessage.INFORMATION_OBLIGATOIRE]: 400,
};

function domainError(exception: unknown): { status: number; message: string } | null {
  if (!(exception instanceof Error)) {
    return null;
  }
  const status = STATUS_BY_DOMAIN_MESSAGE[exception.message];
  if (status === undefined) {
    return null;
  }
  return { status, message: exception.message };
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const known = domainError(exception);
    const status =
      known?.status ??
      (exception instanceof HttpException ? exception.getStatus() : 500);
    const message = known?.message ?? extractErrorMessage(exception);
    const envelope = buildErrorEnvelope(status, message);

    response.status(status).json(envelope);
  }
}
