import { cn } from '../../../lib/utils';
import type { EditableInfoModel } from '../../../../../adapters/presenters/personal-info/editable-info.presenter';

interface EditableInfoRowProps {
  model: EditableInfoModel;
  className?: string;
}

/** Stacked label / value of the contact card. */
export function EditableInfoRow({ model, className }: EditableInfoRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 border-b border-border px-5 py-3.5',
        className,
      )}
    >
      <span className="text-13 text-muted-foreground">
        <span>{model.label}</span>
      </span>
      <span className="flex items-center gap-2 text-15 font-semibold text-foreground">
        <span>{model.value}</span>
      </span>
    </div>
  );
}
