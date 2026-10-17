import { Controller } from 'react-hook-form';
import { InfoNote } from '../../common/feedback/InfoNote';
import { FileDropzone } from '../../common/forms/FileDropzone';
import { FormField } from '../../common/forms/FormField';
import { i18n } from '../../i18n/i18n';
import { RadioGroup } from '../../shared/radio-group';
import { Textarea } from '../../shared/textarea';
import { DocumentFileEntry } from './DocumentFileEntry';
import { FieldError } from '../../common/errors/FieldError';
import { fileEntryError, filesError } from './document-upload.errors';
import { DocumentTypeOption } from './DocumentTypeOption';
import type { DocumentUploadFieldsProps } from './document-upload-fields.props';

/**
 * Fields of the P2.2 upload form (desktop): type, files (and their names),
 * comment. The <form> itself is DocumentUploadForm.
 */
export function DocumentUploadFields({
  form,
  fileKeys,
  model,
  types,
  uploadedFilePresenter,
  counterPresenter,
  describeError,
  onAddFiles,
  onRemoveFile,
}: DocumentUploadFieldsProps) {
  const labels = i18n.messages.documents.upload;
  const category = form.watch('category');
  const comment = form.watch('comment');
  const files = form.watch('files');
  const note = types.find((type) => type.value === category)?.note ?? '';

  return (
    <div className="flex flex-col">
      <FormField
        label={labels.type}
        required
        className="gap-3 border-b border-border px-6 py-5"
      >
        <Controller
          control={form.control}
          name="category"
          render={({ field }) => (
            <RadioGroup
              aria-label={labels.type}
              value={field.value}
              onValueChange={field.onChange}
              className="grid-cols-4 gap-2.5"
            >
              {types.map((type) => (
                <DocumentTypeOption key={type.value} model={type} />
              ))}
            </RadioGroup>
          )}
        />
        {note !== '' && (
          <InfoNote
            className="border border-purple-100 bg-purple-25 px-3 py-2.5"
            icon={
              <i aria-hidden className="ri-information-line text-18 text-purple-600" />
            }
          >
            <span className="block text-purple-800">{note}</span>
          </InfoNote>
        )}
      </FormField>
      <FormField
        label={labels.file}
        required
        className="gap-3 border-b border-border px-6 py-5"
      >
        <FileDropzone
          prompt={labels.dropzonePrompt}
          action={labels.dropzoneAction}
          hint={model.dropzoneHint}
          accept={model.accept}
          multiple
          onFiles={onAddFiles}
          className="[&>span]:contents"
        />
        {fileKeys.map((key, index) => (
          <DocumentFileEntry
            key={key}
            id={`document-name-${key}`}
            fileName={files[index]?.file.name ?? ''}
            model={uploadedFilePresenter.present(files[index]?.file ?? { name: '', size: 0 })}
            nameField={form.register(`files.${index}.name`)}
            nameMaxLength={model.nameMaxLength}
            error={describeError(fileEntryError(form, index))}
            onRemove={() => onRemoveFile(index)}
          />
        ))}
        <FieldError message={describeError(filesError(form))} />
      </FormField>
      <FormField
        label={labels.comment}
        optional
        htmlFor="document-comment"
        hint={counterPresenter.present(comment.length, model.commentMaxLength)}
        className="gap-2 px-6 py-5"
      >
        <Textarea
          id="document-comment"
          maxLength={model.commentMaxLength}
          className="h-14 min-h-0"
          {...form.register('comment')}
        />
        <FieldError message={describeError(form.formState.errors.comment?.message)} />
      </FormField>
    </div>
  );
}
