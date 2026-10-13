import type { LeavesComposition } from '../../../composition/leaves.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetLeaves } from '../../hooks/useGetLeaves';
import { i18n } from '../../i18n/i18n';
import { Leaves } from './Leaves';

interface LeavesPageProps {
  deps: LeavesComposition;
}

export function LeavesPage({ deps }: LeavesPageProps) {
  const leaves = useGetLeaves(deps);

  if (leaves.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (leaves.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <Leaves model={leaves.data} />;
}
