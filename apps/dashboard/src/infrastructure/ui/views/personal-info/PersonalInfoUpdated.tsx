import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { EditableInfoCard } from './components/EditableInfoCard';
import { UpdateSuccessBanner } from './components/UpdateSuccessBanner';
import type { PersonalInfoUpdatedViewModel } from '../../../../adapters/presenters/personal-info/personal-info-updated.presenter';

interface PersonalInfoUpdatedProps {
  model: PersonalInfoUpdatedViewModel;
}

/** P3.4 — personal information right after a contact details update. */
export function PersonalInfoUpdated({ model }: PersonalInfoUpdatedProps) {
  const labels = i18n.messages.personalInfo;

  return (
    <PageContent className="gap-6">
      <UpdateSuccessBanner title={labels.updated.title} description={model.notice} />
      <PageHeader title={labels.view.title} description={model.lastUpdate} />
      <EditableInfoCard
        fields={model.contact}
        editVariant="outline"
        closed
        className="box-content w-[calc(50%-12px)]"
      />
    </PageContent>
  );
}
