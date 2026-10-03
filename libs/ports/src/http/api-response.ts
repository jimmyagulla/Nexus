export type EnvelopedResponse<T> = {
  data: T;
  status: number;
  message: string;
};

export type ApiResponse<T> = T | EnvelopedResponse<T>;

export type ErrorEnvelope = {
  status: number;
  message: string;
};
