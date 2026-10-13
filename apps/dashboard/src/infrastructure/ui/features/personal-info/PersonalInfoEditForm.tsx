import { InfoNote } from '../../common/feedback/InfoNote';
import { i18n } from '../../i18n/i18n';
import { ContactField } from './ContactField';
import type { ContactFieldModel } from '../../../../adapters/presenters/personal-info/personal-info.view-models';

interface PersonalInfoEditFormProps {
  fields: ContactFieldModel[];
}

/** Contact details fields of P3.2 and the bank details note. */
export function PersonalInfoEditForm({ fields }: PersonalInfoEditFormProps) {
  return (
    <form className="flex flex-col gap-4.5 p-6">
      {fields.map((field) => (
        <ContactField key={field.id} model={field} />
      ))}
      <InfoNote icon={<i aria-hidden className="ri-bank-line text-18 text-subtle" />}>
        <span className="block text-muted-foreground">
          {i18n.messages.personalInfo.edit.bankNote}
        </span>
      </InfoNote>
    </form>
  );
}
