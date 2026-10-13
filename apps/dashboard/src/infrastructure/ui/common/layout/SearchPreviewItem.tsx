import { i18n } from '../../i18n/i18n';
import type { SearchPreviewResult } from '../../../../adapters/presenters/shell/shell.presenter';

interface SearchPreviewItemProps {
  result: SearchPreviewResult;
}

export function SearchPreviewItem({ result }: SearchPreviewItemProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-2 first:bg-accent hover:bg-accent">
      <i aria-hidden className="ri-file-paper-2-line text-20 shrink-0 text-primary" />
      <span className="flex flex-1 flex-col">
        <span className="text-14 font-semibold text-foreground">
          {result.title}
        </span>
        <span className="text-12 text-subtle">{result.subtitle}</span>
      </span>
      <button type="button" className="text-12 font-semibold text-primary">
        {i18n.messages.common.view}
      </button>
      <button
        type="button"
        aria-label={i18n.messages.common.download}
        className="text-primary"
      >
        <i aria-hidden className="ri-download-2-line text-18" />
      </button>
    </li>
  );
}
