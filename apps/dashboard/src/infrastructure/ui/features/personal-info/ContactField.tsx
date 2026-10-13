import { FormField } from '../../common/forms/FormField';
import { cn } from '../../lib/utils';
import { Input } from '../../shared/input';
import type { ContactFieldModel } from '../../../../adapters/presenters/personal-info/personal-info.view-models';

interface ContactFieldProps {
  model: ContactFieldModel;
}

export function ContactField({ model }: ContactFieldProps) {
  const id = `contact-${model.id}`;

  return (
    <FormField label={<span>{model.label}</span>} htmlFor={id}>
      <Input
        id={id}
        type={model.type ?? 'text'}
        defaultValue={model.value}
        className={cn(model.modified && 'border-2 border-ring')}
      />
    </FormField>
  );
}
