import { FormField } from '../../common/forms/FormField';
import { i18n } from '../../i18n/i18n';
import { AdornedInput } from '../../common/forms/AdornedInput';
import { RadioGroup } from '../../shared/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/select';
import { Textarea } from '../../shared/textarea';
import { RequestFieldLabel } from './RequestFieldLabel';
import { ExpenseTypeCard, type ExpenseTypeOption } from './ExpenseTypeCard';

export interface ProfessionalExpenseFormModel {
  types: ExpenseTypeOption[];
  type: string;
  period: string;
  periods: string[];
  days: string;
  /** "2,50 € / jour" */
  rate: string;
  total: string;
  description: string;
  /** "Non requis pour ce type de frais" */
  proofNotice: string;
}

/** Numbered sections of the professional expense request (P7.2). */
export function ProfessionalExpenseForm({
  request,
}: {
  request: ProfessionalExpenseFormModel;
}) {
  const labels = i18n.messages.professionalExpenses.request;

  return (
    <>
      <div className="flex flex-col gap-2.5 border-b border-border px-6 py-4">
        <span id="expense-type-label" className="text-14 font-bold">
          <RequestFieldLabel text={labels.type} required />
        </span>
        <RadioGroup
          aria-labelledby="expense-type-label"
          defaultValue={request.type}
          className="grid-cols-4 gap-2.5"
        >
          {request.types.map((option) => (
            <ExpenseTypeCard key={option.value} option={option} />
          ))}
        </RadioGroup>
      </div>
      <div className="grid grid-cols-[1fr_2fr] gap-6 border-b border-border px-6 py-4">
        <FormField
          label={<RequestFieldLabel text={labels.period} required />}
          htmlFor="expense-period"
        >
          <Select defaultValue={request.period}>
            <SelectTrigger id="expense-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {request.periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          label={<RequestFieldLabel text={labels.calculation} required />}
          htmlFor="expense-days"
          hint={labels.calculationHint}
        >
          <div className="flex items-center gap-2.5 text-14">
            <AdornedInput
              id="expense-days"
              inputMode="numeric"
              defaultValue={request.days}
              containerClassName="w-30"
              className="font-bold"
              end={<span className="text-subtle">{labels.days}</span>}
            />
            <span className="text-muted-foreground">{labels.times}</span>
            <span className="flex h-10 items-center rounded-sm border border-border bg-muted px-3 text-body">
              {request.rate}
            </span>
            <span className="text-muted-foreground">{labels.equals}</span>
            <output
              htmlFor="expense-days"
              className="text-20 font-bold text-heading"
            >
              {request.total}
            </output>
          </div>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-6 px-6 py-4">
        <FormField
          label={
            <RequestFieldLabel
              text={labels.description4}
              note={i18n.messages.common.optional}
            />
          }
          htmlFor="expense-description"
        >
          <Textarea
            id="expense-description"
            defaultValue={request.description}
            className="h-16 min-h-16 px-3"
          />
        </FormField>
        <FormField
          label={<RequestFieldLabel text={labels.proof} note={labels.proofHint} />}
        >
          <div className="flex h-16 items-center justify-center gap-2 rounded-lg border border-dashed border-disabled bg-blue-25 text-13 text-muted-foreground">
            <i aria-hidden className="ri-upload-cloud-2-line text-20 text-link" />
            {request.proofNotice}
          </div>
        </FormField>
      </div>
    </>
  );
}
