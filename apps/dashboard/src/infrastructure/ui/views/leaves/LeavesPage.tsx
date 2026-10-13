import type { LeavesComposition } from '../../../composition/leaves.composition';
import { Leaves } from './Leaves';

interface LeavesPageProps {
  deps: LeavesComposition;
}

export function LeavesPage({ deps }: LeavesPageProps) {
  return <Leaves model={deps.leavesPresenter.present()} />;
}
