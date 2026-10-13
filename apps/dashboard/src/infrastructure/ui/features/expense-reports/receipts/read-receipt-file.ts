import { ReceiptDetailsInput } from '@hexagonal-monorepo-template/domain';

function readBytes(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export async function readReceiptFile(
  file: File,
): Promise<ReceiptDetailsInput> {
  return {
    fileName: file.name,
    mimeType: file.type,
    content: await readBytes(file),
    expenseId: null,
  };
}
