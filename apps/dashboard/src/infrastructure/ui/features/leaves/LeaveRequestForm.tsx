import { AdornedInput } from '../../common/forms/AdornedInput';
import { FormField } from '../../common/forms/FormField';
import { i18n } from '../../i18n/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/select';
import { Textarea } from '../../shared/textarea';

export interface LeaveRequestFormValues {
  typeOptions: string[];
  type: string;
  startDate: string;
  endDate: string;
  /** Computed, read-only: "2 jours ouvrés". */
  dayCount: string;
  comment: string;
}

interface LeaveRequestFormProps {
  defaults: LeaveRequestFormValues;
}

/** Fields of the leave request: type, period, computed day count, comment. */
export function LeaveRequestForm({ defaults }: LeaveRequestFormProps) {
  const labels = i18n.messages.leaves.request;

  return (
    <div className="flex flex-col gap-4.5">
      <FormField label={`${labels.type} `} htmlFor="leave-type" required>
        <Select defaultValue={defaults.type}>
          <SelectTrigger id="leave-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {defaults.typeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={`${labels.startDate} `} htmlFor="leave-start" required>
          <AdornedInput
            id="leave-start"
            defaultValue={defaults.startDate}
            end={<i aria-hidden className="ri-calendar-line text-primary" />}
          />
        </FormField>
        <FormField label={`${labels.endDate} `} htmlFor="leave-end" required>
          <AdornedInput
            id="leave-end"
            defaultValue={defaults.endDate}
            containerClassName="border-2 border-ring px-2.75"
            end={<i aria-hidden className="ri-calendar-line text-primary" />}
          />
        </FormField>
      </div>
      <FormField label={labels.dayCount} htmlFor="leave-day-count">
        <output
          id="leave-day-count"
          className="flex h-10 items-center justify-between rounded-sm border border-border bg-muted px-3 text-14"
        >
          <b className="font-bold">{defaults.dayCount}</b>
          <span className="flex items-center gap-1 text-12 text-muted-foreground">
            <i aria-hidden className="ri-calculator-line" />
            {labels.computedAutomatically}
          </span>
        </output>
      </FormField>
      <FormField label={`${labels.comment} `} htmlFor="leave-comment" optional>
        <Textarea id="leave-comment" className="h-18" defaultValue={defaults.comment} />
      </FormField>
    </div>
  );
}
