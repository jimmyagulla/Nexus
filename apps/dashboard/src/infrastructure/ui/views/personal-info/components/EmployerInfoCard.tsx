import { i18n } from '../../../i18n/i18n';
import { Button } from '../../../shared/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../../../shared/card';
import { EmployerInfoRow } from './EmployerInfoRow';
import type { EmployerInfoModel } from '../../../../../adapters/presenters/personal-info/personal-info.view-models';

interface EmployerInfoCardProps {
  fields: EmployerInfoModel[];
}

/** "Informations gérées par l'employeur" card, read only. */
export function EmployerInfoCard({ fields }: EmployerInfoCardProps) {
  const labels = i18n.messages.personalInfo.view;

  return (
    <Card>
      <CardHeader className="justify-start py-4">
        <i aria-hidden className="ri-lock-2-line text-20 text-subtle" />
        <div className="flex flex-col gap-0.5">
          <CardTitle>{labels.employerTitle}</CardTitle>
          <CardDescription>{labels.employerDescription}</CardDescription>
        </div>
      </CardHeader>
      {fields.map((field) => (
        <EmployerInfoRow key={field.id} model={field} />
      ))}
      <div className="flex px-5 py-3">
        <Button variant="link" className="h-auto gap-1.5 px-0 text-13">
          <i aria-hidden className="ri-question-answer-line" />
          {labels.reportError}
        </Button>
      </div>
    </Card>
  );
}
