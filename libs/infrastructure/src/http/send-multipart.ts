import { JsonResponse } from './send-json';

export type MultipartRequest = {
  url: string;
  fields: readonly { name: string; value: string }[];
  files: readonly {
    field: string;
    fileName: string;
    contentType: string;
    content: Uint8Array;
  }[];
  token?: string;
};

/**
 * Posts a multipart form and reads a JSON answer. The browser (or Node) sets
 * the multipart boundary itself: no Content-Type header is forced here.
 */
export async function sendMultipart(
  input: MultipartRequest,
): Promise<JsonResponse> {
  const form = new FormData();
  for (const field of input.fields) {
    form.append(field.name, field.value);
  }
  for (const file of input.files) {
    form.append(
      file.field,
      new Blob([file.content as Uint8Array<ArrayBuffer>], { type: file.contentType }),
      file.fileName,
    );
  }

  const headers: Record<string, string> = {};
  if (input.token !== undefined) {
    headers['Authorization'] = `Bearer ${input.token}`;
  }

  const response = await fetch(input.url, {
    method: 'POST',
    headers,
    body: form,
  });
  const body: unknown = await response.json();
  return { ok: response.ok, status: response.status, body };
}
