import { fileExtensionOf } from '../value-objects/document-file-format';

/**
 * The same names, each made unique within the list, whatever its case: a
 * repeated name gets a counter before its extension (`a.pdf`, `a (2).pdf`).
 */
export function distinctFileNames(names: readonly string[]): string[] {
  const taken = new Set<string>();
  return names.map((name) => {
    let candidate = name;
    for (let counter = 2; taken.has(candidate.toLowerCase()); counter += 1) {
      candidate = withCounter(name, counter);
    }
    taken.add(candidate.toLowerCase());
    return candidate;
  });
}

function withCounter(name: string, counter: number): string {
  const extension = fileExtensionOf(name);
  if (extension === '') {
    return `${name} (${counter})`;
  }
  const dot = name.length - extension.length - 1;
  return `${name.slice(0, dot)} (${counter})${name.slice(dot)}`;
}
