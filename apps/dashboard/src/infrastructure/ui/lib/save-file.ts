import type { ExchangeFileInput } from '@hexagonal-monorepo-template/domain';

export function saveFile(file: ExchangeFileInput): void {
  const url = URL.createObjectURL(
    new Blob([Uint8Array.from(file.content)], { type: file.mimeType }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = file.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
