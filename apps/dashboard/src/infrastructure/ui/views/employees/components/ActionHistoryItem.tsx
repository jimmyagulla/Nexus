import type { ActionHistoryItemModel } from '../../../../../adapters/presenters/employees/employee.presenter';

/** Dotted line of an employee's actions history. */
export function ActionHistoryItem({ item }: { item: ActionHistoryItemModel }) {
  return (
    <div className="flex gap-3 border-b border-border px-5 py-2.5 text-14">
      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-link" />
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground">{item.label}</span>
        <span className="text-12 text-subtle">{item.date}</span>
      </div>
    </div>
  );
}
