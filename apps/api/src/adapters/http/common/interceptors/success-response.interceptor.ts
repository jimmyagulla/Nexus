import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buildSuccessEnvelope } from '../dto/api-response.mapper';
import { SuccessEnvelope } from '../dto/api-response.types';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessEnvelope<unknown>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => buildSuccessEnvelope(data, statusCode)),
    );
  }
}
