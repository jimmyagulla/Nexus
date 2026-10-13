import { i18n } from '../../i18n/i18n';
import { SearchPreviewItem } from './SearchPreviewItem';
import type { SearchPreview } from '../../../../adapters/presenters/shell/shell.presenter';

interface SearchPreviewPanelProps {
  preview: SearchPreview;
}

/** Results of the smart search: interpretation chips, matches, actions, key hints. */
export function SearchPreviewPanel({ preview }: SearchPreviewPanelProps) {
  const labels = i18n.messages.shell.search;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 text-12 text-muted-foreground">
        <i aria-hidden className="ri-sparkling-2-line text-16 text-link" />
        {labels.understoodAs}
        {preview.interpretation.map((chip) => (
          <span
            key={chip}
            className="inline-flex h-5.5 items-center rounded-full bg-accent px-2 font-bold text-primary"
          >
            {chip}
          </span>
        ))}
      </div>
      <span className="px-4 pb-1 pt-3 text-12 font-semibold text-subtle">
        {preview.groupLabel}
      </span>
      <ul>
        {preview.results.map((result) => (
          <SearchPreviewItem key={result.title} result={result} />
        ))}
      </ul>
      <span className="mt-2 border-t border-border px-4 pb-1 pt-3 text-12 font-semibold text-subtle">
        {labels.actions}
      </span>
      <button
        type="button"
        className="flex items-center gap-3 px-4 pb-3 pt-2 text-left hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
      >
        <i aria-hidden className="ri-download-cloud-2-line text-20 text-primary" />
        <span className="flex-1 text-14 font-semibold text-foreground">
          {preview.action}
        </span>
        <i aria-hidden className="ri-arrow-right-line text-16 text-disabled" />
      </button>
      <div className="flex gap-4 border-t border-border bg-grey-50 px-4 py-2 text-11 text-subtle">
        <span>{labels.open}</span>
        <span>{labels.navigate}</span>
        <span>{labels.close}</span>
      </div>
    </>
  );
}
