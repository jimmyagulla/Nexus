import { Link } from '@tanstack/react-router';
import { InfoNote } from '../../common/feedback/InfoNote';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { OvertimeDeclarationForm } from '../../features/overtime/OvertimeDeclarationForm';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Card } from '../../shared/card';
import { OvertimeCounterPanel } from './components/OvertimeCounterPanel';
import type { OvertimeDeclarationViewModel } from '../../../../adapters/presenters/overtime/overtime-declaration.presenter';

interface OvertimeDeclarationProps {
  model: OvertimeDeclarationViewModel;
}

/** P5.2 — overtime declaration form with its effect on the counter. */
export function OvertimeDeclaration({ model }: OvertimeDeclarationProps) {
  const labels = i18n.messages.overtime.declaration;
  const common = i18n.messages.common;

  return (
    <PageContent className="md:py-7">
      <PageHeader
        size="form"
        title={labels.title}
        description={
          <span>
            {`${common.requiredFieldsPrefix} `}
            <span className="text-red-500">*</span>
            {` ${common.requiredFieldsSuffix}`}
          </span>
        }
      />
      <Card className="flex flex-col">
        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 p-6">
          <OvertimeDeclarationForm defaults={model.form} />
          <div className="flex flex-col gap-3.5">
            <OvertimeCounterPanel {...model.counter} />
            <InfoNote>
              {`${labels.validatedBy} ${model.validator}. ${labels.premiumNote}`}
            </InfoNote>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline">{common.saveDraft}</Button>
          <Button asChild className="px-5">
            <Link to={AppRoutes.overtime}>
              <i aria-hidden className="ri-send-plane-line" />
              {labels.send}
            </Link>
          </Button>
        </div>
      </Card>
    </PageContent>
  );
}
