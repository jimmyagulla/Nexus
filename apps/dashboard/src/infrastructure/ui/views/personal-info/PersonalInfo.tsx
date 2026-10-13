import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { EditableInfoCard } from './components/EditableInfoCard';
import type { EditableInfoModel } from './components/EditableInfoRow';
import { EmployerInfoCard } from './components/EmployerInfoCard';
import type { EmployerInfoModel } from './components/EmployerInfoRow';

export interface PersonalInfoViewModel {
  /** "Dernière mise à jour le 12/06/2026" */
  lastUpdate: string;
  contact: EditableInfoModel[];
  employer: EmployerInfoModel[];
}

interface PersonalInfoProps {
  model: PersonalInfoViewModel;
}

/** P3.1 — the employee's personal information. */
export function PersonalInfo({ model }: PersonalInfoProps) {
  return (
    <PageContent className="gap-6">
      <PageHeader
        title={i18n.messages.personalInfo.view.title}
        description={model.lastUpdate}
      />
      <div className="grid grid-cols-2 items-start gap-6">
        <EditableInfoCard fields={model.contact} withDescription />
        <EmployerInfoCard fields={model.employer} />
      </div>
    </PageContent>
  );
}
