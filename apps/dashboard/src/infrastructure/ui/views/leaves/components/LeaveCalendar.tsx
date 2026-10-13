import { i18n } from '../../../i18n/i18n';
import { Card } from '../../../shared/card';
import { LeaveCalendarDay, type LeaveCalendarDayModel } from './LeaveCalendarDay';
import {
  LeaveCalendarLegendItem,
  type LeaveCalendarLegendTone,
} from './LeaveCalendarLegendItem';

export interface LeaveCalendarModel {
  /** "Octobre 2026" */
  month: string;
  /** Monday-first grid, padding cells included. */
  days: LeaveCalendarDayModel[];
}

const legendTones: LeaveCalendarLegendTone[] = [
  'accepted',
  'pending',
  'today',
  'weekend',
];

/** Month grid of the leaves screen, with its navigation and legend. */
export function LeaveCalendar({ month, days }: LeaveCalendarModel) {
  const labels = i18n.messages.leaves.calendar;
  const weekdays = Object.entries(labels.weekdays);

  return (
    <Card className="flex flex-col gap-3 px-5 py-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={labels.previousMonth}
          className="flex rounded-sm text-primary focus-visible:outline-none focus-visible:shadow-focus"
        >
          <i aria-hidden className="ri-arrow-left-s-line text-22" />
        </button>
        <span className="text-16 font-bold text-heading">{month}</span>
        <button
          type="button"
          aria-label={labels.nextMonth}
          className="flex rounded-sm text-primary focus-visible:outline-none focus-visible:shadow-focus"
        >
          <i aria-hidden className="ri-arrow-right-s-line text-22" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-12 font-semibold text-subtle">
        {weekdays.map(([key, label]) => (
          <span key={key}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, index) => (
          <LeaveCalendarDay key={index} {...day} />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 pt-1 text-12 text-body">
        {legendTones.map((tone) => (
          <LeaveCalendarLegendItem
            key={tone}
            tone={tone}
            label={labels.legend[tone]}
          />
        ))}
      </div>
    </Card>
  );
}
