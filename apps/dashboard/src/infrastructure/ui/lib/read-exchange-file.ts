import type { ExchangeFileInput } from '@hexagonal-monorepo-template/domain';

export async function readExchangeFile(file: File): Promise<ExchangeFileInput> {
  return {
    fileName: file.name,
    mimeType: file.type,
    content: new Uint8Array(await readBytes(file)),
  };
}

function readBytes(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
