import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { buildErrorEnvelope, extractErrorMessage } from '../dto/api-response.mapper';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = extractErrorMessage(exception);
    const envelope = buildErrorEnvelope(status, message);

    response.status(status).json(envelope);
  }
}
