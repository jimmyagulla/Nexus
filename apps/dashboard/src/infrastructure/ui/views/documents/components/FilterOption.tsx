import { Checkbox } from '../../../shared/checkbox';
import type { FilterOptionModel } from '../../../../../adapters/presenters/documents/documents.view-models';

interface FilterOptionProps {
  model: FilterOptionModel;
}

/** Checkbox line of a filter group, tinted while checked. */
export function FilterOption({ model }: FilterOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-sm bg-card px-2 py-0.75 text-14 text-foreground has-[[data-state=checked]]:bg-accent">
      <Checkbox defaultChecked={model.checked} />
      <span className="flex-1">
        <span>{model.label}</span>
      </span>
      <span className="text-12 text-subtle">
        <span>{model.count}</span>
      </span>
    </label>
  );
}
