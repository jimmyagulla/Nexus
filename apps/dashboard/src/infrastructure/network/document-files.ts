import { ErrorCode } from '@hexagonal-monorepo-template/domain';

/** Reads a file behind a short-lived link, typed with its known media type. */
export async function fetchFile(url: string, contentType: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return new Blob([await response.arrayBuffer()], { type: contentType });
}

/** Hands a file to the browser download manager, under the given name. */
export function saveFile(file: Blob | string, fileName: string): void {
  const url = typeof file === 'string' ? file : URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (typeof file !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
