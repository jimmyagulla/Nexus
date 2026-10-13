import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ExchangeDirection,
  ExchangeFilters,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import { i18n } from '../../../i18n/i18n';
import {
  EMPTY_EXCHANGE_FILTERS_FORM,
  exchangeFiltersSchema,
  type ExchangeFiltersFormValues,
} from './exchange-filters.schema';

const SELECT_CLASSES =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

interface ExchangeFiltersFormProps {
  errorPresenter: ErrorPresenter;
  withDirection: boolean;
  onFilter: (filters: ExchangeFilters) => void;
  onReset: () => void;
}

export function ExchangeFiltersForm({
  errorPresenter,
  withDirection,
  onFilter,
  onReset,
}: ExchangeFiltersFormProps) {
  const form = useForm<ExchangeFiltersFormValues, unknown, ExchangeFilters>({
    resolver: zodResolver(exchangeFiltersSchema),
    defaultValues: EMPTY_EXCHANGE_FILTERS_FORM,
  });
  const labels = i18n.messages.cabinet.filters;
  const fromError = form.formState.errors.from;
  const toError = form.formState.errors.to;

  return (
    <form
      className="flex flex-wrap items-end gap-4"
      onSubmit={form.handleSubmit(onFilter)}
    >
      <div>
        <label className="block text-sm" htmlFor="filter-category">
          {labels.category}
        </label>
        <Input id="filter-category" {...form.register('category')} />
      </div>
      <div>
        <label className="block text-sm" htmlFor="filter-from">
          {labels.from}
        </label>
        <Input id="filter-from" type="date" {...form.register('from')} />
        {fromError ? <p>{errorPresenter.present(fromError.message)}</p> : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="filter-to">
          {labels.to}
        </label>
        <Input id="filter-to" type="date" {...form.register('to')} />
        {toError ? <p>{errorPresenter.present(toError.message)}</p> : null}
      </div>
      {withDirection ? (
        <div>
          <label className="block text-sm" htmlFor="filter-direction">
            {labels.direction}
          </label>
          <select
            id="filter-direction"
            className={SELECT_CLASSES}
            {...form.register('direction')}
          >
            <option value="">{labels.all}</option>
            {Object.values(ExchangeDirection).map((direction) => (
              <option key={direction} value={direction}>
                {i18n.messages.cabinet.directions[direction]}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div>
        <label className="block text-sm" htmlFor="filter-status">
          {labels.status}
        </label>
        <select
          id="filter-status"
          className={SELECT_CLASSES}
          {...form.register('status')}
        >
          <option value="">{labels.all}</option>
          {Object.values(ExchangeStatus).map((status) => (
            <option key={status} value={status}>
              {i18n.messages.cabinet.statuses[status]}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit">{labels.apply}</Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          form.reset(EMPTY_EXCHANGE_FILTERS_FORM);
          onReset();
        }}
      >
        {labels.reset}
      </Button>
    </form>
  );
}
