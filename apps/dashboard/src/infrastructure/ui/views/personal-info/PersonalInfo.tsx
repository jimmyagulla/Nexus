import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { EditableInfoCard } from './components/EditableInfoCard';
import { EmployerInfoCard } from './components/EmployerInfoCard';
import type { EditableInfoModel } from '../../../../adapters/presenters/personal-info/editable-info.presenter';
import type { EmployerInfoModel } from '../../../../adapters/presenters/personal-info/employer-info.presenter';
import type { PersonalInfoLastUpdateModel } from '../../../../adapters/presenters/personal-info/personal-info-last-update.presenter';

interface PersonalInfoProps {
  lastUpdate: PersonalInfoLastUpdateModel;
  contact: EditableInfoModel[];
  employer: EmployerInfoModel[];
  onEdit: () => void;
}

/** P3.1 — the employee's personal information. */
export function PersonalInfo({ lastUpdate, contact, employer, onEdit }: PersonalInfoProps) {
  return (
    <PageContent className="gap-6">
      <PageHeader
        title={i18n.messages.personalInfo.view.title}
        description={lastUpdate}
      />
      <div className="grid grid-cols-2 items-start gap-6">
        <EditableInfoCard fields={contact} onEdit={onEdit} withDescription />
        <EmployerInfoCard fields={employer} />
      </div>
    </PageContent>
  );
}
