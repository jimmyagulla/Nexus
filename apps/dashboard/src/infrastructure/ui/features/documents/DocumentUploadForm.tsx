import { InfoNote } from '../../common/feedback/InfoNote';
import { FileDropzone } from '../../common/forms/FileDropzone';
import { FormField } from '../../common/forms/FormField';
import { UploadedFile } from '../../common/forms/UploadedFile';
import { i18n } from '../../i18n/i18n';
import { RadioGroup } from '../../shared/radio-group';
import { Textarea } from '../../shared/textarea';
import { DocumentTypeOption, type DocumentTypeOptionModel } from './DocumentTypeOption';

export interface DocumentUploadFormModel {
  types: DocumentTypeOptionModel[];
  selectedType: string;
  /** Reminder tied to the selected type. */
  note: string;
  file: { name: string; details: string };
  comment: string;
}

interface DocumentUploadFormProps {
  model: DocumentUploadFormModel;
}

/** Fields of the P2.2 upload form: type, file, comment. */
export function DocumentUploadForm({ model }: DocumentUploadFormProps) {
  const labels = i18n.messages.documents.upload;

  return (
    <form className="flex flex-col">
      <FormField
        label={labels.type}
        required
        className="gap-3 border-b border-border px-6 py-5"
      >
        <RadioGroup
          aria-label={labels.type}
          defaultValue={model.selectedType}
          className="grid-cols-4 gap-2.5"
        >
          {model.types.map((type) => (
            <DocumentTypeOption key={type.value} model={type} />
          ))}
        </RadioGroup>
        <InfoNote
          className="border border-purple-100 bg-purple-25 px-3 py-2.5"
          icon={
            <i aria-hidden className="ri-information-line text-18 text-purple-600" />
          }
        >
          <span className="block text-purple-800">{model.note}</span>
        </InfoNote>
      </FormField>
      <FormField
        label={labels.file}
        required
        className="gap-3 border-b border-border px-6 py-5"
      >
        <FileDropzone
          prompt={labels.dropzonePrompt}
          action={labels.dropzoneAction}
          hint={labels.dropzoneHint}
          className="[&>span]:contents"
        />
        <UploadedFile name={model.file.name} details={model.file.details} />
      </FormField>
      <FormField
        label={labels.comment}
        optional
        htmlFor="document-comment"
        className="gap-2 px-6 py-5"
      >
        <Textarea
          id="document-comment"
          defaultValue={model.comment}
          className="h-14 min-h-0"
        />
      </FormField>
    </form>
  );
}
