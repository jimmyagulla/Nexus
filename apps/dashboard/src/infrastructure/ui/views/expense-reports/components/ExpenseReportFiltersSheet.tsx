import {
  ExpenseReportCategory,
  ExpenseReportStatus,
  isExpenseReportProofPresence,
} from '@hexagonal-monorepo-template/domain';
import { FilterGroup } from '../../../common/data/FilterGroup';
import { FilterOption } from '../../../common/data/FilterOption';
import { AdornedInput } from '../../../common/forms/AdornedInput';
import { FormField } from '../../../common/forms/FormField';
import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';
import { DatePicker } from '../../../shared/date-picker';
import {
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../../../shared/sheet';
import { ToggleGroup, ToggleGroupItem } from '../../../shared/toggle-group';
import type { ExpenseReportsListHandlers } from './expense-reports-list.handlers';
import type { ExpenseReportFiltersModel } from '../../../../../adapters/presenters/expense-reports/expense-report-filters.presenter';

interface ExpenseReportFiltersSheetProps {
  model: ExpenseReportFiltersModel;
  handlers: ExpenseReportsListHandlers;
}

/** "Du" / "Au", "Minimum" / "Maximum": a small grey label over the control. */
const BOUND_FIELD = 'min-w-0 flex-1 gap-1';
const BOUND_LABEL = 'text-12 font-normal text-muted-foreground';
const AMOUNT_CONTROL = 'h-9 px-2.5 focus-within:px-2.25';

/** Floating "Filtres" panel of the expense reports list. Filters apply as they change. */
export function ExpenseReportFiltersSheet({ model, handlers }: ExpenseReportFiltersSheetProps) {
  const labels = i18n.messages.expenseReports.filters;

  return (
    <SheetContent className="box-content">
      <SheetHeader
        icon={<i aria-hidden className="ri-filter-3-line text-20 text-primary" />}
      >
        <SheetTitle>{labels.title}</SheetTitle>
        <SheetDescription>{model.appliedLabel}</SheetDescription>
      </SheetHeader>
      <SheetBody>
        <FilterGroup title={labels.category}>
          {model.categories.map((option) => (
            <FilterOption
              key={option.id}
              model={option}
              onToggle={() => handlers.onToggleCategory(option.id as ExpenseReportCategory)}
            />
          ))}
        </FilterGroup>
        <FilterGroup title={labels.status}>
          {model.statuses.map((option) => (
            <FilterOption
              key={option.id}
              model={option}
              onToggle={() => handlers.onToggleStatus(option.id as ExpenseReportStatus)}
            />
          ))}
        </FilterGroup>
        <FilterGroup title={labels.period}>
          <div className="flex gap-2.5">
            <FormField label={labels.from} htmlFor="expense-reports-from" className={BOUND_FIELD} labelClassName={BOUND_LABEL}>
              <DatePicker
                id="expense-reports-from"
                placeholder={labels.datePlaceholder}
                value={model.from}
                onValueChange={handlers.onFromChange}
              />
            </FormField>
            <FormField label={labels.to} htmlFor="expense-reports-to" className={BOUND_FIELD} labelClassName={BOUND_LABEL}>
              <DatePicker
                id="expense-reports-to"
                placeholder={labels.datePlaceholder}
                value={model.to}
                onValueChange={handlers.onToChange}
              />
            </FormField>
          </div>
        </FilterGroup>
        <FilterGroup title={labels.amount}>
          <div className="flex gap-2.5">
            <FormField label={labels.minAmount} htmlFor="expense-reports-min" className={BOUND_FIELD} labelClassName={BOUND_LABEL}>
              <AdornedInput
                id="expense-reports-min"
                inputMode="decimal"
                autoComplete="off"
                value={model.minAmount}
                onChange={(event) => handlers.onMinAmountChange(event.target.value)}
                containerClassName={AMOUNT_CONTROL}
                end={<span className="text-subtle">€</span>}
              />
            </FormField>
            <FormField label={labels.maxAmount} htmlFor="expense-reports-max" className={BOUND_FIELD} labelClassName={BOUND_LABEL}>
              <AdornedInput
                id="expense-reports-max"
                inputMode="decimal"
                autoComplete="off"
                value={model.maxAmount}
                onChange={(event) => handlers.onMaxAmountChange(event.target.value)}
                containerClassName={AMOUNT_CONTROL}
                end={<span className="text-subtle">€</span>}
              />
            </FormField>
          </div>
        </FilterGroup>
        <FilterGroup title={labels.project}>
          {model.projects.length === 0 && (
            <span className="px-2 py-0.75 text-13 text-subtle">{model.noProjectsLabel}</span>
          )}
          {model.projects.map((option) => (
            <FilterOption
              key={option.id}
              model={option}
              onToggle={() => handlers.onToggleProject(option.id)}
            />
          ))}
        </FilterGroup>
        <FilterGroup title={labels.proof}>
          <ToggleGroup
            type="single"
            value={model.proof}
            onValueChange={(value: string) =>
              handlers.onProofChange(isExpenseReportProofPresence(value) ? value : null)
            }
          >
            {model.proofs.map((proof) => (
              <ToggleGroupItem key={proof.value} value={proof.value}>
                {proof.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FilterGroup>
      </SheetBody>
      <SheetFooter>
        <Button variant="link" className="h-auto px-0" onClick={handlers.onClearFilters}>
          {i18n.messages.common.reset}
        </Button>
        <SheetClose asChild>
          <Button>{model.showResultsLabel}</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
