import type { PersonalInfoComposition } from '../../../composition/personal-info.composition';
import { PersonalInfoUpdated } from './PersonalInfoUpdated';

interface PersonalInfoUpdatedPageProps {
  deps: PersonalInfoComposition;
}

export function PersonalInfoUpdatedPage({ deps }: PersonalInfoUpdatedPageProps) {
  return <PersonalInfoUpdated model={deps.personalInfoUpdatedPresenter.present()} />;
}
