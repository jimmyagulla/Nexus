import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PersonalContactValues } from '@hexagonal-monorepo-template/domain';
import { InfoNote } from '../../common/feedback/InfoNote';
import { i18n } from '../../i18n/i18n';
import { ContactField } from './ContactField';
import {
  personalContactSchema,
  type PersonalContactFormValues,
} from './personal-contact.schema';
import type { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import type { ContactFieldModel } from '../../../../adapters/presenters/personal-info/contact-fields.presenter';

/** Id of the edition <form>, for the submit button of the modal footer (`form` attribute). */
export const PERSONAL_INFO_EDIT_FORM_ID = 'personal-info-edit-form';

interface PersonalInfoEditFormProps {
  fields: ContactFieldModel[];
  /** The saved contact details, the form starts from. */
  saved: PersonalContactValues;
  errorPresenter: ErrorPresenter;
  onSubmit: (values: PersonalContactFormValues) => void;
}

/**
 * The contact details edition: its state, its validation and its <form>
 * element, starting from the saved values. Fields of P3.2 and the bank note.
 */
export function PersonalInfoEditForm({
  fields,
  saved,
  errorPresenter,
  onSubmit,
}: PersonalInfoEditFormProps) {
  const form = useForm<PersonalContactFormValues>({
    resolver: zodResolver(personalContactSchema),
    defaultValues: saved,
  });

  return (
    <form
      id={PERSONAL_INFO_EDIT_FORM_ID}
      noValidate
      className="flex flex-col gap-4.5 p-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {fields.map((field) => {
        const message = form.formState.errors[field.id]?.message;
        return (
          <ContactField
            key={field.id}
            model={field}
            registration={form.register(field.id)}
            modified={form.formState.dirtyFields[field.id] === true}
            error={message === undefined ? null : errorPresenter.present(message)}
          />
        );
      })}
      <InfoNote icon={<i aria-hidden className="ri-bank-line text-18 text-subtle" />}>
        <span className="block text-muted-foreground">
          {i18n.messages.personalInfo.edit.bankNote}
        </span>
      </InfoNote>
    </form>
  );
}
