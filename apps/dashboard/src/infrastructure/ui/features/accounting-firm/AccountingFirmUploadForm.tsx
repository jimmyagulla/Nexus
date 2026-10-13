import { AdornedInput } from '../../common/forms/AdornedInput';
import { FileDropzone } from '../../common/forms/FileDropzone';
import { FormField } from '../../common/forms/FormField';
import { UploadedFile } from '../../common/forms/UploadedFile';
import { i18n } from '../../i18n/i18n';
import { Input } from '../../shared/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/select';
import { ToggleGroup, ToggleGroupItem } from '../../shared/toggle-group';
import type { AccountingFirmUploadFormModel } from '../../../../adapters/presenters/accounting-firm/accounting-firm.view-models';

const toggleItemClassName = 'h-9.5 flex-none border-l-0 px-3';

/** Fields of the "Déposer un document pour le cabinet" form. */
export function AccountingFirmUploadForm({
  model,
}: {
  model: AccountingFirmUploadFormModel;
}) {
  const labels = i18n.messages.accountingFirm.upload;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-6 py-4">
        <FormField label={labels.documentType} htmlFor="firm-document-type" required>
          <Select defaultValue={model.documentType}>
            <SelectTrigger id="firm-document-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {model.documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label={labels.recipientField} htmlFor="firm-recipient" required>
          <Select defaultValue={model.recipient}>
            <SelectTrigger id="firm-recipient">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {model.recipients.map((recipient) => (
                <SelectItem key={recipient} value={recipient}>
                  {recipient}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField label={labels.files} required className="gap-2.5 px-6 pb-4">
        <FileDropzone
          prompt={labels.dropPrompt}
          action={labels.dropAction}
          multiple
          className="p-3.5"
        />
        {model.files.map((file) => (
          <UploadedFile
            key={file.name}
            name={file.name}
            details={file.details}
            className="py-2"
            icon={
              <i aria-hidden className={`${file.icon} shrink-0 text-20 text-primary`} />
            }
          />
        ))}
      </FormField>

      <div className="grid grid-cols-2 gap-4 px-6 pb-4">
        <FormField label={labels.transmissionDate}>
          <div className="flex gap-2">
            <ToggleGroup
              type="single"
              defaultValue={model.transmission}
              className="shrink-0"
            >
              <ToggleGroupItem value="immediate" className={toggleItemClassName}>
                {labels.immediate}
              </ToggleGroupItem>
              <ToggleGroupItem value="scheduled" className={toggleItemClassName}>
                {labels.scheduled}
              </ToggleGroupItem>
            </ToggleGroup>
            <AdornedInput
              aria-label={labels.transmissionDate}
              defaultValue={model.transmissionDate}
              containerClassName="flex-1 px-2.5"
              end={<i aria-hidden className="ri-calendar-line text-primary" />}
            />
          </div>
        </FormField>
        <FormField label={labels.comment} htmlFor="firm-comment" optional>
          <Input id="firm-comment" defaultValue={model.comment} />
        </FormField>
      </div>
    </>
  );
}
