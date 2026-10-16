import type { DocumentSort } from '@hexagonal-monorepo-template/domain';
import { SortButton } from '../../../common/data/SortButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/dropdown-menu';
import type { DocumentSortModel } from '../../../../../adapters/presenters/documents/documents.presenter';

interface DocumentSortMenuProps {
  model: DocumentSortModel;
  onSortChange: (sort: DocumentSort) => void;
}

/** "Trier : …" and the orderings it offers, all descending. */
export function DocumentSortMenu({ model, onSortChange }: DocumentSortMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SortButton label={model.label} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {model.options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onSortChange(option.value)}
            aria-current={option.selected || undefined}
            className={option.selected ? 'font-semibold' : undefined}
          >
            <i
              aria-hidden
              className={option.selected ? 'ri-check-line' : 'ri-check-line invisible'}
            />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
