import {
  DocumentCategory,
  DocumentEmitter,
  DocumentStatus,
  isDocumentEmitter,
} from '@hexagonal-monorepo-template/domain';
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
import { FilterGroup } from './FilterGroup';
import { FilterOption } from './FilterOption';
import type { DocumentsListHandlers } from './documents-list.handlers';
import type { DocumentFiltersModel } from '../../../../../adapters/presenters/documents/documents.presenter';

interface DocumentFiltersSheetProps {
  model: DocumentFiltersModel;
  handlers: DocumentsListHandlers;
}

/** "Du" / "Au" of the period: a small grey label over the date picker. */
const PERIOD_FIELD = 'min-w-0 flex-1 gap-1';
const PERIOD_LABEL = 'text-12 font-normal text-muted-foreground';

/** Floating "Filtres" panel of the documents list. Filters apply as they change. */
export function DocumentFiltersSheet({ model, handlers }: DocumentFiltersSheetProps) {
  const labels = i18n.messages.documents.filters;

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
              onToggle={() => handlers.onToggleCategory(option.id as DocumentCategory)}
            />
          ))}
        </FilterGroup>
        <FilterGroup title={labels.status}>
          {model.statuses.map((option) => (
            <FilterOption
              key={option.id}
              model={option}
              onToggle={() => handlers.onToggleStatus(option.id as DocumentStatus)}
            />
          ))}
        </FilterGroup>
        <FilterGroup title={labels.period}>
          <div className="flex gap-2.5">
            <FormField
              label={labels.from}
              htmlFor="documents-period-from"
              className={PERIOD_FIELD}
              labelClassName={PERIOD_LABEL}
            >
              <DatePicker
                id="documents-period-from"
                placeholder={labels.datePlaceholder}
                value={model.from}
                onValueChange={handlers.onFromChange}
              />
            </FormField>
            <FormField
              label={labels.to}
              htmlFor="documents-period-to"
              className={PERIOD_FIELD}
              labelClassName={PERIOD_LABEL}
            >
              <DatePicker
                id="documents-period-to"
                placeholder={labels.datePlaceholder}
                value={model.to}
                onValueChange={handlers.onToChange}
              />
            </FormField>
          </div>
        </FilterGroup>
        <FilterGroup title={labels.emitter}>
          <ToggleGroup
            type="single"
            value={model.emitter}
            onValueChange={(value: string) =>
              handlers.onEmitterChange(isDocumentEmitter(value) ? (value as DocumentEmitter) : null)
            }
          >
            {model.emitters.map((emitter) => (
              <ToggleGroupItem key={emitter.value} value={emitter.value}>
                {emitter.label}
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
