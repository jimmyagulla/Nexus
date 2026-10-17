/** A `data:` URL carrying the content itself, base64-encoded. */
export function toDataUrl(contentType: string, content: Uint8Array): string {
  let binary = '';
  for (const byte of content) {
    binary += String.fromCharCode(byte);
  }
  return `data:${contentType};base64,${btoa(binary)}`;
}
