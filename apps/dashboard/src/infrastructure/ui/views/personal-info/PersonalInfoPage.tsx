import type { PersonalInfoPageComposition } from '../../../composition/personal-info/personal-info-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetPersonalInfo } from '../../hooks/useGetPersonalInfo';
import { i18n } from '../../i18n/i18n';
import { PersonalInfo } from './PersonalInfo';

interface PersonalInfoPageProps {
  deps: PersonalInfoPageComposition;
}

export function PersonalInfoPage({ deps }: PersonalInfoPageProps) {
  const personalInfo = useGetPersonalInfo(deps);

  if (personalInfo.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (personalInfo.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <PersonalInfo model={personalInfo.data} />;
}
