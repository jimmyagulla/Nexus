export type ApiSuccess<T> = {
  status: number;
  message: string;
  data: T;
};

export type ApiError = {
  status: number;
  message: string;
};
