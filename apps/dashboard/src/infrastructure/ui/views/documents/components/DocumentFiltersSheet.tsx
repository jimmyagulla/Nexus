import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';
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
import { PeriodField } from './PeriodField';
import type { DocumentFiltersModel } from '../../../../../adapters/presenters/documents/documents.presenter';

interface DocumentFiltersSheetProps {
  model: DocumentFiltersModel;
}

/** Floating "Filtres" panel of the documents list. */
export function DocumentFiltersSheet({ model }: DocumentFiltersSheetProps) {
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
            <FilterOption key={option.id} model={option} />
          ))}
        </FilterGroup>
        <FilterGroup title={labels.status}>
          {model.statuses.map((option) => (
            <FilterOption key={option.id} model={option} />
          ))}
        </FilterGroup>
        <FilterGroup title={labels.period}>
          <div className="flex gap-2.5">
            <PeriodField label={labels.from} placeholder={labels.datePlaceholder} />
            <PeriodField label={labels.to} placeholder={labels.datePlaceholder} />
          </div>
        </FilterGroup>
        <FilterGroup title={labels.emitter}>
          <ToggleGroup type="single" defaultValue={model.emitter}>
            {model.emitters.map((emitter) => (
              <ToggleGroupItem key={emitter.value} value={emitter.value}>
                {emitter.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FilterGroup>
      </SheetBody>
      <SheetFooter>
        <Button variant="link" className="h-auto px-0">
          {i18n.messages.common.reset}
        </Button>
        <SheetClose asChild>
          <Button>{model.showResultsLabel}</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
