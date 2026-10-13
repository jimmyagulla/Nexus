import type { OvertimeComposition } from '../../../composition/overtime.composition';
import { Overtime } from './Overtime';

interface OvertimePageProps {
  deps: OvertimeComposition;
}

export function OvertimePage({ deps }: OvertimePageProps) {
  return <Overtime model={deps.overtimePresenter.present()} />;
}
