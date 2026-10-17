import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Controller } from 'react-hook-form';
import { InfoNote } from '../../common/feedback/InfoNote';
import { FormField } from '../../common/forms/FormField';
import { i18n } from '../../i18n/i18n';
import { Textarea } from '../../shared/textarea';
import { FieldError } from '../../common/errors/FieldError';
import { MobileDocumentTypeOption } from './MobileDocumentTypeOption';
import { MobileFilePicker } from './MobileFilePicker';
import { MobileUploadedFile } from './MobileUploadedFile';
import { fileEntryError, filesError } from './document-upload.errors';
import type { DocumentUploadFieldsProps } from './document-upload-fields.props';

/** Fields of the M.3 mobile upload form. */
export function MobileDocumentUploadForm({
  form,
  fileKeys,
  model,
  presenter,
  describeError,
  onAddFiles,
  onRemoveFile,
}: DocumentUploadFieldsProps) {
  const labels = i18n.messages.documents.upload.mobile;
  const category = form.watch('category');
  const comment = form.watch('comment');
  const files = form.watch('files');
  const note = model.types.find((type) => type.value === category)?.mobileNote ?? '';

  return (
    <div className="flex flex-col gap-4.5">
      <FormField label={labels.type} required className="gap-2.5">
        <Controller
          control={form.control}
          name="category"
          render={({ field }) => (
            <RadioGroupPrimitive.Root
              aria-label={labels.type}
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-2 gap-2"
            >
              {model.types.map((type) => (
                <MobileDocumentTypeOption key={type.value} model={type} />
              ))}
            </RadioGroupPrimitive.Root>
          )}
        />
      </FormField>
      <FormField label={labels.file} required className="gap-2.5">
        <div className="grid grid-cols-2 gap-2">
          <MobileFilePicker icon="ri-camera-line" label={labels.takePhoto} capture onFiles={onAddFiles} />
          <MobileFilePicker
            icon="ri-folder-open-line"
            label={labels.chooseFile}
            accept={model.accept}
            onFiles={onAddFiles}
          />
        </div>
        {fileKeys.map((key, index) => {
          const file = files[index]?.file ?? { name: '', size: 0 };
          const described = presenter.presentFile(file);
          return (
            <MobileUploadedFile
              key={key}
              id={`mobile-document-name-${key}`}
              name={file.name}
              details={described.details}
              icon={described.icon}
              nameField={form.register(`files.${index}.name`)}
              nameMaxLength={model.nameMaxLength}
              error={describeError(fileEntryError(form, index))}
              onRemove={() => onRemoveFile(index)}
            />
          );
        })}
        <FieldError message={describeError(filesError(form))} />
      </FormField>
      {note !== '' && (
        <InfoNote
          className="border border-purple-100 bg-purple-25 px-3 py-2.5"
          icon={<i aria-hidden className="ri-information-line text-18 text-purple-600" />}
        >
          <span className="block text-12 leading-4.25 text-purple-800">{note}</span>
        </InfoNote>
      )}
      <FormField
        label={labels.comment}
        optional
        htmlFor="mobile-document-comment"
        hint={presenter.presentCounter(comment.length, model.commentMaxLength)}
        className="gap-2"
      >
        <Textarea
          id="mobile-document-comment"
          maxLength={model.commentMaxLength}
          className="h-16.5 min-h-0"
          {...form.register('comment')}
        />
      </FormField>
    </div>
  );
}
