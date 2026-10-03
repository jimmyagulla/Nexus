import {
  BUSINESS_ERROR_MESSAGES,
  type BusinessErrorCode,
} from './business-error-codes';

export class BusinessError extends Error {
  readonly code: BusinessErrorCode;

  constructor(code: BusinessErrorCode) {
    super(BUSINESS_ERROR_MESSAGES[code]);
    this.code = code;
    this.name = 'BusinessError';
  }
}
