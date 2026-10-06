export function parsePort(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid port: ${value}`);
  }

  return parsed;
}

export function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') {
    return fallback;
  }

  switch (value.toLowerCase()) {
    case 'true':
    case '1':
      return true;
    case 'false':
    case '0':
      return false;
    default:
      throw new Error(`Invalid boolean: ${value}`);
  }
}

export function readOptional(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export function parsePersistence(
  value: string | undefined,
  fallback: 'memory' | 'postgres',
): 'memory' | 'postgres' {
  if (value === undefined || value === '') {
    return fallback;
  }

  if (value === 'memory' || value === 'postgres') {
    return value;
  }

  throw new Error(`Invalid persistence: ${value}`);
}
