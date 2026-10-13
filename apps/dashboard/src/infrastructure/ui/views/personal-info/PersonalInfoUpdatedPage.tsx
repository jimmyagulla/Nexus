import type { PersonalInfoUpdatedComposition } from '../../../composition/personal-info-updated.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetPersonalInfoUpdated } from '../../hooks/useGetPersonalInfoUpdated';
import { i18n } from '../../i18n/i18n';
import { PersonalInfoUpdated } from './PersonalInfoUpdated';

interface PersonalInfoUpdatedPageProps {
  deps: PersonalInfoUpdatedComposition;
}

export function PersonalInfoUpdatedPage({ deps }: PersonalInfoUpdatedPageProps) {
  const personalInfoUpdated = useGetPersonalInfoUpdated(deps);

  if (personalInfoUpdated.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (personalInfoUpdated.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <PersonalInfoUpdated model={personalInfoUpdated.data} />;
}
