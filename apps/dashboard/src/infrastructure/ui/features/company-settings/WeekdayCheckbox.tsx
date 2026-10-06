import type { UseFormRegisterReturn } from 'react-hook-form';
import type { WeekdayViewModel } from '../../../../adapters/presenters/company-settings.presenter';

interface WeekdayCheckboxProps {
  weekday: WeekdayViewModel;
  registration: UseFormRegisterReturn;
}

export function WeekdayCheckbox({
  weekday,
  registration,
}: WeekdayCheckboxProps) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        value={weekday.value}
        defaultChecked={weekday.selected}
        {...registration}
      />
      {weekday.label}
    </label>
  );
}
