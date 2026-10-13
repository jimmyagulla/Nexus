import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { EmployeeOptionViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/select';
import { i18n } from '../../../i18n/i18n';
import {
  ALL_EMPLOYEES,
  presenceFiltersSchema,
  type PresenceFiltersValues,
} from './presence-filters.schema';

const NO_FILTER: PresenceFiltersValues = {
  employeeId: ALL_EMPLOYEES,
  from: '',
  to: '',
};

interface PresenceFiltersFormProps {
  employees: EmployeeOptionViewModel[];
  errorPresenter: ErrorPresenter;
  onFilter: (values: PresenceFiltersValues) => void;
}

export function PresenceFiltersForm({
  employees,
  errorPresenter,
  onFilter,
}: PresenceFiltersFormProps) {
  const form = useForm<PresenceFiltersValues>({
    resolver: zodResolver(presenceFiltersSchema),
    defaultValues: NO_FILTER,
  });
  const fromError = form.formState.errors.from;
  const toError = form.formState.errors.to;

  return (
    <form
      className="flex flex-wrap items-end gap-4"
      onSubmit={form.handleSubmit(onFilter)}
    >
      <div>
        <label className="block text-sm" htmlFor="presence-filter-employee">
          {i18n.messages.presences.employee}
        </label>
        <Controller
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="presence-filter-employee">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_EMPLOYEES}>
                  {i18n.messages.presences.allEmployees}
                </SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.value} value={employee.value}>
                    {employee.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <label className="block text-sm" htmlFor="presence-filter-from">
          {i18n.messages.presences.fromMonth}
        </label>
        <Input id="presence-filter-from" type="month" {...form.register('from')} />
        {fromError ? <p>{errorPresenter.present(fromError.message)}</p> : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="presence-filter-to">
          {i18n.messages.presences.toMonth}
        </label>
        <Input id="presence-filter-to" type="month" {...form.register('to')} />
        {toError ? <p>{errorPresenter.present(toError.message)}</p> : null}
      </div>
      <Button type="submit">{i18n.messages.presences.filter}</Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          form.reset(NO_FILTER);
          onFilter(NO_FILTER);
        }}
      >
        {i18n.messages.presences.resetFilters}
      </Button>
    </form>
  );
}
