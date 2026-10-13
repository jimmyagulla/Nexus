import { AdornedInput } from '../../common/forms/AdornedInput';
import { FileDropzone } from '../../common/forms/FileDropzone';
import { FormField } from '../../common/forms/FormField';
import { i18n } from '../../i18n/i18n';
import { Textarea } from '../../shared/textarea';
import { HoursStepper } from './HoursStepper';
import type { OvertimeDeclarationFormValues } from '../../../../adapters/presenters/overtime/overtime-declaration.presenter';

interface OvertimeDeclarationFormProps {
  defaults: OvertimeDeclarationFormValues;
}

/** Fields of an overtime declaration: date, hours, time range, reason, proof. */
export function OvertimeDeclarationForm({ defaults }: OvertimeDeclarationFormProps) {
  const labels = i18n.messages.overtime.declaration;

  return (
    <div className="flex flex-col gap-4.5">
      <div className="grid grid-cols-2 gap-4">
        <FormField label={`${labels.date} `} htmlFor="overtime-date" required>
          <AdornedInput
            id="overtime-date"
            defaultValue={defaults.date}
            end={<i aria-hidden className="ri-calendar-line text-primary" />}
          />
        </FormField>
        <FormField label={`${labels.hours} `} htmlFor="overtime-hours" required>
          <HoursStepper id="overtime-hours" defaultValue={defaults.hours} />
        </FormField>
      </div>
      <FormField label={`${labels.timeRange} `} optional>
        <div className="grid grid-cols-2 gap-4">
          <AdornedInput
            aria-label={labels.startTime}
            defaultValue={defaults.startTime}
            end={<i aria-hidden className="ri-time-line text-primary" />}
          />
          <AdornedInput
            aria-label={labels.endTime}
            defaultValue={defaults.endTime}
            end={<i aria-hidden className="ri-time-line text-primary" />}
          />
        </div>
      </FormField>
      <FormField label={`${labels.reason} `} htmlFor="overtime-reason" required>
        <Textarea
          id="overtime-reason"
          className="h-18 border-2 border-ring px-2.75"
          defaultValue={defaults.reason}
        />
      </FormField>
      <FormField label={`${labels.proof} `} optional>
        <FileDropzone
          prompt={labels.dropPrompt}
          action={labels.dropAction}
          className="gap-2.5 p-3.5 [&_i]:text-22 [&>span]:contents"
        />
      </FormField>
    </div>
  );
}
