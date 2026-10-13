import type { OvertimeComposition } from '../../../composition/overtime.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetOvertime } from '../../hooks/useGetOvertime';
import { i18n } from '../../i18n/i18n';
import { Overtime } from './Overtime';

interface OvertimePageProps {
  deps: OvertimeComposition;
}

export function OvertimePage({ deps }: OvertimePageProps) {
  const overtime = useGetOvertime(deps);

  if (overtime.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (overtime.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <Overtime model={overtime.data} />;
}
