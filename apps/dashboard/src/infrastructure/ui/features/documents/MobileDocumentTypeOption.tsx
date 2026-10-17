import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { DocumentTypeOptionModel } from '../../../../adapters/presenters/documents/document-type-options.presenter';

interface MobileDocumentTypeOptionProps {
  model: DocumentTypeOptionModel;
}

/** 48px radio chip of the mobile document type picker. */
export function MobileDocumentTypeOption({ model }: MobileDocumentTypeOptionProps) {
  return (
    <RadioGroupPrimitive.Item
      value={model.value}
      className="flex h-12 items-center gap-2 rounded-lg border border-grey-300 bg-card px-3 text-14 font-semibold text-body focus-visible:outline-none focus-visible:shadow-focus data-[state=checked]:box-content data-[state=checked]:border-2 data-[state=checked]:border-ring data-[state=checked]:bg-accent data-[state=checked]:font-bold data-[state=checked]:text-heading"
    >
      <i aria-hidden className={`${model.icon} text-18 text-primary`} />
      {model.shortLabel}
    </RadioGroupPrimitive.Item>
  );
}
