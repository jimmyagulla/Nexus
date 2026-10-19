/**
 * How many items the person has neither opened nor downloaded yet: what a
 * notification badge counts, for payslips as for documents.
 */
export function countUnseen(
  items: readonly { id: string }[],
  seenIds: ReadonlySet<string>,
): number {
  return items.filter((item) => !seenIds.has(item.id)).length;
}
