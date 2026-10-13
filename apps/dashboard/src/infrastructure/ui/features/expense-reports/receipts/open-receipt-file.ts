import { ReceiptFileSnapshot } from '@hexagonal-monorepo-template/domain';

export function openReceiptFile(file: ReceiptFileSnapshot): void {
  const url = URL.createObjectURL(
    new Blob([new Uint8Array(file.content)], { type: file.mimeType }),
  );
  window.open(url, '_blank');
}
