import { cn } from '../../../lib/utils';
import { i18n } from '../../../i18n/i18n';

export interface EditableInfoModel {
  id: string;
  label: string;
  value: string;
  /** Just changed: tinted green with a "Modifié" tag. */
  modified?: boolean;
}

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
        model.modified && 'bg-green-25',
        className,
      )}
    >
      <span className="text-13 text-muted-foreground">
        <span>{model.label}</span>
      </span>
      <span className="flex items-center gap-2 text-15 font-semibold text-foreground">
        <span>{model.value}</span>
        {model.modified && (
          <span className="text-12 font-semibold text-green-700">
            {i18n.messages.personalInfo.updated.modified}
          </span>
        )}
      </span>
    </div>
  );
}
