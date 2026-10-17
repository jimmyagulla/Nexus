import { AdornedInput } from '../../common/forms/AdornedInput';
import { FormField } from '../../common/forms/FormField';
import { i18n } from '../../i18n/i18n';
import { Input } from '../../shared/input';
import { ToggleGroup, ToggleGroupItem } from '../../shared/toggle-group';
import { ExpenseProof } from './ExpenseProof';
import { ExpenseSelect } from './ExpenseSelect';
import type { ExpenseFormModel } from '../../../../adapters/presenters/expense-reports/expense-report.presenter';

const FIELD = 'gap-1';
const LABEL = 'text-13';
const CONTROL = 'h-9 px-2.5 focus-within:px-2.25';

/** Fields of the "Ajouter une dépense" panel (P6.2). */
export function ExpenseForm({ expense }: { expense: ExpenseFormModel }) {
  const labels = i18n.messages.expenseReports.expenseForm;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label={labels.date}
          required
          htmlFor="expense-date"
          className={FIELD}
          labelClassName={LABEL}
        >
          <AdornedInput
            id="expense-date"
            required
            defaultValue={expense.date}
            containerClassName={CONTROL}
            end={<i aria-hidden className="ri-calendar-line text-primary" />}
          />
        </FormField>
        <FormField
          label={labels.category}
          required
          htmlFor="expense-category"
          className={FIELD}
          labelClassName={LABEL}
        >
          <ExpenseSelect
            id="expense-category"
            defaultValue={expense.category}
            options={expense.categories}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label={labels.amount}
          required
          htmlFor="expense-amount"
          className={FIELD}
          labelClassName={LABEL}
        >
          <AdornedInput
            id="expense-amount"
            required
            inputMode="decimal"
            defaultValue={expense.amount}
            containerClassName={CONTROL}
            end={<span className="text-subtle">€</span>}
          />
        </FormField>
        <FormField
          label={labels.vat}
          note={labels.vatHint}
          htmlFor="expense-vat"
          className={FIELD}
          labelClassName={LABEL}
        >
          <ExpenseSelect
            id="expense-vat"
            defaultValue={expense.vat}
            options={expense.vatOptions}
          />
        </FormField>
      </div>
      <FormField
        label={labels.paymentMethod}
        required
        className={FIELD}
        labelClassName={LABEL}
      >
        <ToggleGroup
          type="single"
          defaultValue={expense.paymentMethod}
          aria-label={labels.paymentMethod}
        >
          <ToggleGroupItem value="personal">{labels.personalCard}</ToggleGroupItem>
          <ToggleGroupItem value="company">{labels.companyCard}</ToggleGroupItem>
          <ToggleGroupItem value="cash" className="flex-[0.7_1_0%]">
            {labels.cash}
          </ToggleGroupItem>
        </ToggleGroup>
      </FormField>
      <FormField
        label={labels.description}
        required
        htmlFor="expense-description"
        className={FIELD}
        labelClassName={LABEL}
      >
        <Input
          id="expense-description"
          required
          defaultValue={expense.description}
          className="h-9 px-2.5 focus-visible:px-2.25"
        />
      </FormField>
      <FormField
        label={labels.project}
        optional
        htmlFor="expense-project"
        className={FIELD}
        labelClassName={LABEL}
      >
        <ExpenseSelect
          id="expense-project"
          defaultValue={expense.project}
          options={expense.projects}
        />
      </FormField>
      <FormField
        label={labels.proof}
        required
        className={FIELD}
        labelClassName={LABEL}
      >
        <ExpenseProof name={expense.proof.name} details={expense.proof.details} />
      </FormField>
    </>
  );
}
