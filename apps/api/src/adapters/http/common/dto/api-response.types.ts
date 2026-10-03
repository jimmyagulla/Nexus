export interface SuccessEnvelope<T> {
  status: number;
  message: string;
  data: T;
  metadata?: unknown;
}

export interface ErrorEnvelope {
  status: number;
  message: string;
}

export interface ApiResult<T, M = unknown> {
  isApiResult: true;
  data: T;
  message: string;
  metadata?: M;
}
