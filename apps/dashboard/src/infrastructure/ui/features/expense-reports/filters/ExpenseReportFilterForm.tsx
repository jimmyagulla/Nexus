import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseReportFilterInput } from '@hexagonal-monorepo-template/domain';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import { i18n } from '../../../i18n/i18n';
import {
  expenseReportFilterSchema,
  type ExpenseReportFilterFormValues,
} from './expense-report-filter.schema';

interface ExpenseReportFilterFormProps {
  byEmployee: boolean;
  errorPresenter: ErrorPresenter;
  onApply: (filter: ExpenseReportFilterInput) => void;
  onReset: () => void;
}

const EMPTY: ExpenseReportFilterFormValues = {
  employeeId: '',
  status: '',
  from: '',
  to: '',
  minAmount: '',
  maxAmount: '',
};

export function ExpenseReportFilterForm({
  byEmployee,
  errorPresenter,
  onApply,
  onReset,
}: ExpenseReportFilterFormProps) {
  const form = useForm<
    ExpenseReportFilterFormValues,
    unknown,
    ExpenseReportFilterInput
  >({
    resolver: zodResolver(expenseReportFilterSchema),
    defaultValues: EMPTY,
  });
  const { errors } = form.formState;
  const labels = i18n.messages.expenseReports.filters;

  return (
    <form
      className="flex flex-wrap items-end gap-4"
      onSubmit={form.handleSubmit((filter) => onApply(filter))}
    >
      {byEmployee ? (
        <div>
          <label className="block text-sm" htmlFor="filter-employee">
            {labels.employee}
          </label>
          <Input id="filter-employee" {...form.register('employeeId')} />
        </div>
      ) : null}
      <div>
        <label className="block text-sm" htmlFor="filter-status">
          {labels.status}
        </label>
        <select
          id="filter-status"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register('status')}
        >
          <option value="">{labels.allStatuses}</option>
          {Object.entries(i18n.messages.expenseReports.status).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm" htmlFor="filter-from">
          {labels.from}
        </label>
        <Input id="filter-from" type="date" {...form.register('from')} />
        {errors.from ? <p>{errorPresenter.present(errors.from.message)}</p> : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="filter-to">
          {labels.to}
        </label>
        <Input id="filter-to" type="date" {...form.register('to')} />
        {errors.to ? <p>{errorPresenter.present(errors.to.message)}</p> : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="filter-min-amount">
          {labels.minAmount}
        </label>
        <Input
          id="filter-min-amount"
          inputMode="decimal"
          {...form.register('minAmount')}
        />
        {errors.minAmount ? (
          <p>{errorPresenter.present(errors.minAmount.message)}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="filter-max-amount">
          {labels.maxAmount}
        </label>
        <Input
          id="filter-max-amount"
          inputMode="decimal"
          {...form.register('maxAmount')}
        />
        {errors.maxAmount ? (
          <p>{errorPresenter.present(errors.maxAmount.message)}</p>
        ) : null}
      </div>
      <Button type="submit">{labels.apply}</Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          form.reset(EMPTY);
          onReset();
        }}
      >
        {labels.reset}
      </Button>
    </form>
  );
}
