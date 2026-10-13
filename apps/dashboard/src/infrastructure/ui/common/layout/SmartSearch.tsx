import { i18n } from '../../i18n/i18n';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '../../shared/popover';
import { SearchPreviewPanel } from './SearchPreviewPanel';
import type { SearchPreview } from '../../../../adapters/presenters/shell/shell.view-models';

interface SmartSearchProps {
  placeholder: string;
  preview?: SearchPreview;
}

/** Top bar search (⌘ K). Opens the smart results panel under the field. */
export function SmartSearch({ placeholder, preview }: SmartSearchProps) {
  return (
    <Popover>
      <PopoverAnchor asChild>
        <div className="min-w-0 max-w-130 flex-[1_1_520px]">
          <PopoverTrigger asChild>
            <label className="flex h-9.5 items-center gap-2.5 rounded-lg border border-grey-50 bg-grey-50 px-3 has-[:focus]:border-2 has-[:focus]:border-ring has-[:focus]:bg-card has-[:focus]:px-2.75">
              <i aria-hidden className="ri-search-line text-18 shrink-0 text-subtle" />
              <input
                type="search"
                aria-label={placeholder}
                placeholder={placeholder}
                className="min-w-0 flex-1 truncate bg-transparent text-14 text-foreground outline-none placeholder:text-placeholder"
              />
              <span className="rounded-sm border border-border bg-card px-1.5 py-0.5 text-11 font-bold text-subtle">
                {i18n.messages.shell.shortcut}
              </span>
            </label>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      {preview && (
        <PopoverContent
          align="start"
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="flex w-(--radix-popover-trigger-width) flex-col"
        >
          <SearchPreviewPanel preview={preview} />
        </PopoverContent>
      )}
    </Popover>
  );
}
