import type { PersonalInfoUpdatedPageComposition } from '../../../composition/personal-info/personal-info-updated-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetPersonalInfoUpdated } from '../../hooks/useGetPersonalInfoUpdated';
import { i18n } from '../../i18n/i18n';
import { PersonalInfoUpdated } from './PersonalInfoUpdated';

interface PersonalInfoUpdatedPageProps {
  deps: PersonalInfoUpdatedPageComposition;
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
