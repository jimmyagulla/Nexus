/** A list repeats its parameter once per value (`a=1&a=2`); an empty list is left out. */
export function buildUrl(
  base: string,
  params: Record<string, string | number | boolean | readonly string[] | undefined | null>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item: string) => query.append(key, item));
    } else if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  }
  const queryString = query.toString();
  return queryString ? `${base}?${queryString}` : base;
}
