import type { PersonalInfoComposition } from '../../../composition/personal-info.composition';
import { PersonalInfo } from './PersonalInfo';

interface PersonalInfoPageProps {
  deps: PersonalInfoComposition;
}

export function PersonalInfoPage({ deps }: PersonalInfoPageProps) {
  return <PersonalInfo model={deps.personalInfoPresenter.present()} />;
}
