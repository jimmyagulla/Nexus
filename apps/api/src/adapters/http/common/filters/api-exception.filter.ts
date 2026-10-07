import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {
  buildErrorEnvelope,
  extractErrorMessage,
  httpStatusForError,
} from '../dto/api-response.mapper';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = httpStatusForError(exception);
    const message = extractErrorMessage(exception);
    const envelope = buildErrorEnvelope(status, message);

    response.status(status).json(envelope);
  }
}
