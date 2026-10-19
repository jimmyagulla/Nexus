import type { ChangeModel } from '../../../../../adapters/presenters/personal-info/confirm-changes.presenter';

interface ChangeRowProps {
  model: ChangeModel;
}

/** One changed field of the recap: old value struck through, new value. */
export function ChangeRow({ model }: ChangeRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-border px-4 py-3 text-14 last:border-b-0">
      <span className="text-12 text-muted-foreground">{model.label}</span>
      <span className="text-subtle line-through">{model.previous}</span>
      <span className="font-bold text-heading">{model.next}</span>
    </div>
  );
}
