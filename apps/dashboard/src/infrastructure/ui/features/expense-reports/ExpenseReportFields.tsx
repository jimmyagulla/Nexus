import { Controller } from 'react-hook-form';
import { FieldError } from '../../common/errors/FieldError';
import { AdornedInput } from '../../common/forms/AdornedInput';
import { FormField } from '../../common/forms/FormField';
import { i18n } from '../../i18n/i18n';
import { DatePicker } from '../../shared/date-picker';
import { Input } from '../../shared/input';
import { Textarea } from '../../shared/textarea';
import { ToggleGroup, ToggleGroupItem } from '../../shared/toggle-group';
import { ExpenseProofField } from './ExpenseProofField';
import { ExpenseSelect } from './ExpenseSelect';
import type { ExpenseReportFieldsProps } from './expense-report-fields.props';

const SECTION = 'grid grid-cols-2 gap-x-5 gap-y-4 border-b border-border px-6 py-5 last:border-b-0';
const FIELD = 'gap-1.5';
const WIDE = 'col-span-2 gap-1.5';
const CONTROL = 'h-9 px-2.5 focus-within:px-2.25';
const PROJECTS_LIST_ID = 'expense-report-projects';

/**
 * Fields of the expense report form: the expense, then what it is for, then
 * its receipt. The <form> itself is ExpenseReportForm.
 */
export function ExpenseReportFields({
  form,
  model,
  vatOptionsPresenter,
  uploadedFilePresenter,
  counterPresenter,
  describeError,
}: ExpenseReportFieldsProps) {
  const labels = i18n.messages.expenseReports.form;
  const errors = form.formState.errors;
  const [amount, description, proof, keepProof] = form.watch(['amount', 'description', 'proof', 'keepProof']);
  const shownProof =
    proof !== null
      ? { name: proof.name, ...uploadedFilePresenter.present(proof) }
      : keepProof
        ? model.currentProof
        : null;

  return (
    <div className="flex flex-col">
      <div className={SECTION}>
        <FormField label={labels.date} required htmlFor="expense-date" className={FIELD}>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <DatePicker
                id="expense-date"
                placeholder={labels.datePlaceholder}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
          <FieldError message={describeError(errors.date?.message)} />
        </FormField>
        <FormField label={labels.category} required htmlFor="expense-category" className={FIELD}>
          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <ExpenseSelect
                id="expense-category"
                value={field.value}
                onValueChange={field.onChange}
                options={model.categories}
                placeholder={labels.categoryPlaceholder}
                aria-invalid={errors.category !== undefined}
              />
            )}
          />
          <FieldError message={describeError(errors.category?.message)} />
        </FormField>
        <FormField label={labels.amount} required htmlFor="expense-amount" className={FIELD}>
          <AdornedInput
            id="expense-amount"
            inputMode="decimal"
            autoComplete="off"
            aria-invalid={errors.amount !== undefined}
            containerClassName={CONTROL}
            end={<span className="text-subtle">€</span>}
            {...form.register('amount')}
          />
          <FieldError message={describeError(errors.amount?.message)} />
        </FormField>
        <FormField label={labels.vat} note={labels.vatHint} htmlFor="expense-vat" className={FIELD}>
          <Controller
            control={form.control}
            name="vatRate"
            render={({ field }) => (
              <ExpenseSelect
                id="expense-vat"
                value={field.value}
                onValueChange={field.onChange}
                options={vatOptionsPresenter.present(amount)}
                placeholder={i18n.messages.expenseReports.vat.none}
              />
            )}
          />
        </FormField>
        <FormField label={labels.paymentMethod} required labelId="expense-payment-label" className={WIDE}>
          <Controller
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <ToggleGroup
                type="single"
                aria-labelledby="expense-payment-label"
                value={field.value}
                onValueChange={(value: string) => {
                  if (value !== '') {
                    field.onChange(value);
                  }
                }}
              >
                {model.paymentMethods.map((method) => (
                  <ToggleGroupItem key={method.value} value={method.value}>
                    {method.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          />
          <FieldError message={describeError(errors.paymentMethod?.message)} />
        </FormField>
      </div>
      <div className={SECTION}>
        <FormField
          label={labels.description}
          required
          htmlFor="expense-description"
          hint={counterPresenter.present(description.length, model.descriptionMaxLength)}
          className={WIDE}
        >
          <Textarea
            id="expense-description"
            maxLength={model.descriptionMaxLength}
            aria-invalid={errors.description !== undefined}
            className="h-18 min-h-0"
            {...form.register('description')}
          />
          <FieldError message={describeError(errors.description?.message)} />
        </FormField>
        <FormField label={labels.project} optional htmlFor="expense-project" className={WIDE}>
          <Input
            id="expense-project"
            list={PROJECTS_LIST_ID}
            maxLength={model.projectMaxLength}
            autoComplete="off"
            className="h-9 px-2.5 focus-visible:px-2.25"
            {...form.register('project')}
          />
          <datalist id={PROJECTS_LIST_ID}>
            {model.projectSuggestions.map((project) => (
              <option key={project} value={project} />
            ))}
          </datalist>
          <FieldError message={describeError(errors.project?.message)} />
        </FormField>
      </div>
      <div className={SECTION}>
        <FormField label={labels.proof} optional className={WIDE}>
          <ExpenseProofField
            file={shownProof}
            accept={model.accept}
            hint={model.dropzoneHint}
            onPick={(file) => {
              form.setValue('proof', file, { shouldValidate: true });
            }}
            onRemove={() => {
              form.setValue('proof', null, { shouldValidate: true });
              form.setValue('keepProof', false);
            }}
          />
          <FieldError message={describeError(errors.proof?.message)} />
        </FormField>
      </div>
    </div>
  );
}
