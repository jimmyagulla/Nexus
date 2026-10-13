import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ExpenseCategoryViewModel } from '../../../../../adapters/presenters/expense-category.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import { i18n } from '../../../i18n/i18n';
import {
  expenseSchema,
  type ExpenseFormValues,
  type ExpenseValues,
} from './expense.schema';

interface ExpenseFormProps {
  categories: ExpenseCategoryViewModel[];
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: ExpenseValues) => Promise<boolean>;
}

const EMPTY: ExpenseFormValues = {
  date: '',
  categoryId: '',
  amount: '',
  vat: '',
  paymentMethod: '',
  description: '',
  assignment: '',
};

export function ExpenseForm({
  categories,
  errorPresenter,
  submissionError,
  onSubmit,
}: ExpenseFormProps) {
  const form = useForm<ExpenseFormValues, unknown, ExpenseValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: EMPTY,
  });
  const { errors } = form.formState;
  const labels = i18n.messages.expenseReports.expense;

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        if (await onSubmit(values)) {
          form.reset();
        }
      })}
    >
      <div>
        <label className="block text-sm" htmlFor="expense-date">
          {labels.date}
        </label>
        <Input id="expense-date" type="date" {...form.register('date')} />
        {errors.date ? <p>{errorPresenter.present(errors.date.message)}</p> : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="expense-category">
          {labels.category}
        </label>
        <select
          id="expense-category"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register('categoryId')}
        >
          <option value="" />
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.categoryId ? (
          <p>{errorPresenter.present(errors.categoryId.message)}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="expense-amount">
          {labels.amount}
        </label>
        <Input id="expense-amount" inputMode="decimal" {...form.register('amount')} />
        {errors.amount ? (
          <p>{errorPresenter.present(errors.amount.message)}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="expense-vat">
          {labels.vat}
        </label>
        <Input id="expense-vat" inputMode="decimal" {...form.register('vat')} />
        {errors.vat ? <p>{errorPresenter.present(errors.vat.message)}</p> : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="expense-payment-method">
          {labels.paymentMethod}
        </label>
        <Input
          id="expense-payment-method"
          {...form.register('paymentMethod')}
        />
        {errors.paymentMethod ? (
          <p>{errorPresenter.present(errors.paymentMethod.message)}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="expense-description">
          {labels.description}
        </label>
        <Input id="expense-description" {...form.register('description')} />
        {errors.description ? (
          <p>{errorPresenter.present(errors.description.message)}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="expense-assignment">
          {labels.assignment}
        </label>
        <Input id="expense-assignment" {...form.register('assignment')} />
        {errors.assignment ? (
          <p>{errorPresenter.present(errors.assignment.message)}</p>
        ) : null}
      </div>
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.expenseReports.addExpense}</Button>
    </form>
  );
}
