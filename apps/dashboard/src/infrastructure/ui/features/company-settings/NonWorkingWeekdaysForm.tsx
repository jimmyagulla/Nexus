import { WeekdayView } from '../../../../adapters/presenters/company-settings/company-settings.presenter';
import { Button } from '../../shared/button';
import {
  nonWorkingWeekdaysSchema,
  WeekdayToken,
} from './non-working-weekdays.schema';

const tokenByValue: Record<number, (typeof WeekdayToken)[keyof typeof WeekdayToken]> =
  {
    0: WeekdayToken.SUNDAY,
    1: WeekdayToken.MONDAY,
    2: WeekdayToken.TUESDAY,
    3: WeekdayToken.WEDNESDAY,
    4: WeekdayToken.THURSDAY,
    5: WeekdayToken.FRIDAY,
    6: WeekdayToken.SATURDAY,
  };

export function NonWorkingWeekdaysForm({
  weekdays,
  onChange,
}: {
  weekdays: WeekdayView[];
  onChange: (weekdays: number[]) => void;
}) {
  function toggle(value: number) {
    const selected = new Set(
      weekdays.filter((day) => day.selected).map((day) => day.value),
    );
    if (selected.has(value)) {
      selected.delete(value);
    } else {
      selected.add(value);
    }
    const parsed = nonWorkingWeekdaysSchema.safeParse({
      weekdays: [...selected].map((day) => tokenByValue[day]),
    });
    if (parsed.success) {
      onChange(parsed.data.weekdays);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {weekdays.map((day) => (
        <Button
          key={day.value}
          type="button"
          variant={day.selected ? 'default' : 'outline'}
          onClick={() => toggle(day.value)}
        >
          {day.label}
        </Button>
      ))}
    </div>
  );
}
