import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { EmployeeOptionViewModel } from '../../../../../adapters/presenters/presence.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
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
  openPresenceSchema,
  type OpenPresenceValues,
} from './open-presence.schema';

interface OpenPresenceFormProps {
  employees: EmployeeOptionViewModel[];
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: OpenPresenceValues) => Promise<boolean>;
}

export function OpenPresenceForm({
  employees,
  errorPresenter,
  submissionError,
  onSubmit,
}: OpenPresenceFormProps) {
  const form = useForm<OpenPresenceValues>({
    resolver: zodResolver(openPresenceSchema),
    defaultValues: { employeeId: '', month: '' },
  });
  const employeeError = form.formState.errors.employeeId;
  const monthError = form.formState.errors.month;

  return (
    <form
      className="flex flex-wrap items-end gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        if (await onSubmit(values)) {
          form.reset();
        }
      })}
    >
      <div>
        <label className="block text-sm" htmlFor="presence-employee">
          {i18n.messages.presences.employee}
        </label>
        <Controller
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="presence-employee">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.value} value={employee.value}>
                    {employee.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {employeeError ? (
          <p>{errorPresenter.present(employeeError.message)}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm" htmlFor="presence-month">
          {i18n.messages.presences.month}
        </label>
        <Input id="presence-month" type="month" {...form.register('month')} />
        {monthError ? <p>{errorPresenter.present(monthError.message)}</p> : null}
      </div>
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.presences.open}</Button>
    </form>
  );
}
