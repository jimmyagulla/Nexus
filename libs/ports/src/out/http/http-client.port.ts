export type MultipartFile = {
  field: string;
  fileName: string;
  contentType: string;
  content: Uint8Array;
};

/** A form carrying files: text fields (repeatable) and files. */
export type MultipartBody = {
  fields: readonly { name: string; value: string }[];
  files: readonly MultipartFile[];
};

/**
 * The only way the code reaches the network. Requests and answers are JSON,
 * except `postMultipart` (a form sent) and `getBytes` (a file read).
 */
export interface IHttpClient {
  get<T>(url: string, config?: unknown): Promise<T>;
  /** Reads a raw file, e.g. behind a short-lived link. */
  getBytes(url: string, config?: unknown): Promise<Uint8Array>;
  post<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  postMultipart<T>(url: string, body: MultipartBody, config?: unknown): Promise<T>;
  put<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  delete<T>(url: string, config?: unknown): Promise<T>;
}

export const IHttpClient = Symbol('IHttpClient');
