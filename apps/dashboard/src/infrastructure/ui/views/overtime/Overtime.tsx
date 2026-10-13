import { Link } from '@tanstack/react-router';
import { FilterButton } from '../../common/data/FilterButton';
import { SearchField } from '../../common/data/SearchField';
import { SortButton } from '../../common/data/SortButton';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { OvertimeCounter } from './components/OvertimeCounter';
import { OvertimeDeclarationTable } from './components/OvertimeDeclarationTable';
import { OvertimeHighlightCounter } from './components/OvertimeHighlightCounter';
import type { OvertimeViewModel } from '../../../../adapters/presenters/overtime/overtime.presenter';

interface OvertimeProps {
  model: OvertimeViewModel;
}

/** P5.1 — overtime counters and the employee's declarations. */
export function Overtime({ model }: OvertimeProps) {
  const labels = i18n.messages.overtime.list;

  return (
    <PageContent className="gap-4.5 md:py-7">
      <PageHeader
        className="*:gap-1"
        title={labels.title}
        description={labels.description}
        actions={
          <Button asChild className="shadow-focus">
            <Link to={AppRoutes.overtimeDeclaration}>
              <i aria-hidden className="ri-add-line text-18" />
              {labels.declare}
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-3.5">
        <OvertimeHighlightCounter label={labels.pending} value={model.counters.pending} />
        <OvertimeCounter label={labels.approved} value={model.counters.approved} />
        <OvertimeCounter label={labels.processed} value={model.counters.processed} />
      </div>
      <div className="flex items-center gap-2">
        <SearchField placeholder={labels.search} />
        <FilterButton className="border-primary" />
        <span className="flex-1" />
        <SortButton label={labels.sort} />
      </div>
      <OvertimeDeclarationTable declarations={model.declarations} />
    </PageContent>
  );
}
