import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/dropdown-menu';
import type { PayslipYearOptionModel } from '../../../../../adapters/presenters/payslips/payslip-year.presenter';

interface PayslipYearMenuProps {
  options: PayslipYearOptionModel[];
  onChoose: (year: number) => void;
  /** The "year ▾" button that opens the menu. */
  children: ReactNode;
}

/** The years the employee has a payslip in, opened from the year shown. */
export function PayslipYearMenu({ options, onChoose, children }: PayslipYearMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.year}
            aria-current={option.selected || undefined}
            onSelect={() => onChoose(option.year)}
          >
            <i aria-hidden className={option.selected ? 'ri-check-line' : 'ri-calendar-line'} />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
