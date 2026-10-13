import type { PersonalInfoEditComposition } from '../../../composition/personal-info-edit.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetPersonalInfoEdit } from '../../hooks/useGetPersonalInfoEdit';
import { i18n } from '../../i18n/i18n';
import { PersonalInfoEdit } from './PersonalInfoEdit';

interface PersonalInfoEditPageProps {
  deps: PersonalInfoEditComposition;
}

export function PersonalInfoEditPage({ deps }: PersonalInfoEditPageProps) {
  const personalInfoEdit = useGetPersonalInfoEdit(deps);

  if (personalInfoEdit.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (personalInfoEdit.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <PersonalInfoEdit model={personalInfoEdit.data} />;
}
