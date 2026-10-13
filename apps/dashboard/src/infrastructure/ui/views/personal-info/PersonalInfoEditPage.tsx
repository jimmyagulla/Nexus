import type { PersonalInfoComposition } from '../../../composition/personal-info.composition';
import { PersonalInfoEdit } from './PersonalInfoEdit';

interface PersonalInfoEditPageProps {
  deps: PersonalInfoComposition;
}

export function PersonalInfoEditPage({ deps }: PersonalInfoEditPageProps) {
  return <PersonalInfoEdit model={deps.personalInfoEditPresenter.present()} />;
}
