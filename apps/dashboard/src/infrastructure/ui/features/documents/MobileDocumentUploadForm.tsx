import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { InfoNote } from '../../common/feedback/InfoNote';
import { FormField } from '../../common/forms/FormField';
import { i18n } from '../../i18n/i18n';
import { Textarea } from '../../shared/textarea';
import { MobileDocumentTypeOption } from './MobileDocumentTypeOption';
import { MobileFilePicker } from './MobileFilePicker';
import { MobileUploadedFile } from './MobileUploadedFile';
import type { MobileDocumentUploadFormModel } from '../../../../adapters/presenters/documents/document-upload.presenter';

interface MobileDocumentUploadFormProps {
  model: MobileDocumentUploadFormModel;
}

/** Fields of the M.3 mobile upload form. */
export function MobileDocumentUploadForm({ model }: MobileDocumentUploadFormProps) {
  const labels = i18n.messages.documents.upload.mobile;

  return (
    <form className="flex flex-col gap-4.5">
      <FormField label={labels.type} required className="gap-2.5">
        <RadioGroupPrimitive.Root
          aria-label={labels.type}
          defaultValue={model.selectedType}
          className="grid grid-cols-2 gap-2"
        >
          {model.types.map((type) => (
            <MobileDocumentTypeOption key={type.value} model={type} />
          ))}
        </RadioGroupPrimitive.Root>
      </FormField>
      <FormField label={labels.file} required className="gap-2.5">
        <div className="grid grid-cols-2 gap-2">
          <MobileFilePicker icon="ri-camera-line" label={labels.takePhoto} capture />
          <MobileFilePicker icon="ri-folder-open-line" label={labels.chooseFile} />
        </div>
        <MobileUploadedFile name={model.file.name} details={model.file.details} />
      </FormField>
      <InfoNote
        className="border border-purple-100 bg-purple-25 px-3 py-2.5"
        icon={<i aria-hidden className="ri-information-line text-18 text-purple-600" />}
      >
        <span className="block text-12 leading-4.25 text-purple-800">{model.note}</span>
      </InfoNote>
      <FormField
        label={labels.comment}
        optional
        htmlFor="mobile-document-comment"
        className="gap-2"
      >
        <Textarea id="mobile-document-comment" className="h-16.5 min-h-0" />
      </FormField>
    </form>
  );
}
