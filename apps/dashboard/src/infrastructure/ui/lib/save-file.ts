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
