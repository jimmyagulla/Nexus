import { RadioGroupItem } from '../../shared/radio-group';
import type { DocumentTypeOptionModel } from '../../../../adapters/presenters/documents/document-type-options.presenter';

interface DocumentTypeOptionProps {
  model: DocumentTypeOptionModel;
}

/** Radio card of the document type step (desktop). */
export function DocumentTypeOption({ model }: DocumentTypeOptionProps) {
  const id = `document-type-${model.value}`;

  return (
    <label
      htmlFor={id}
      className="relative flex cursor-pointer flex-col gap-1.5 rounded-lg border border-grey-300 bg-card p-3 has-[[data-state=checked]]:border-2 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent"
    >
      <div className="flex justify-between">
        <i aria-hidden className={`${model.icon} text-22 text-primary`} />
        <RadioGroupItem
          id={id}
          value={model.value}
          className="data-[state=checked]:text-ring"
        />
      </div>
      <span className="text-14 font-bold text-heading">
        <span>{model.label}</span>
      </span>
      <span className="text-12 leading-4 text-muted-foreground">
        <span>{model.description}</span>
      </span>
    </label>
  );
}
