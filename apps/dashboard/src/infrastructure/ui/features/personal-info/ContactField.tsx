import type { UseFormRegisterReturn } from 'react-hook-form';
import { FieldError } from '../../common/errors/FieldError';
import { FormField } from '../../common/forms/FormField';
import { cn } from '../../lib/utils';
import { Input } from '../../shared/input';
import type { ContactFieldModel } from '../../../../adapters/presenters/personal-info/contact-fields.presenter';

interface ContactFieldProps {
  model: ContactFieldModel;
  registration: UseFormRegisterReturn;
  /** Differs from the saved value: blue 2px border. */
  modified: boolean;
  /** Translated refusal of the value, or null. */
  error: string | null;
}

export function ContactField({ model, registration, modified, error }: ContactFieldProps) {
  const id = `contact-${model.id}`;

  return (
    <FormField label={<span>{model.label}</span>} htmlFor={id}>
      <Input
        id={id}
        type={model.type}
        aria-invalid={error !== null}
        className={cn(modified && 'border-2 border-ring')}
        {...registration}
      />
      <FieldError message={error} />
    </FormField>
  );
}
