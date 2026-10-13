import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import { PersonalInfoEditForm } from '../../features/personal-info/PersonalInfoEditForm';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Card, CardFooter } from '../../shared/card';
import { Dialog, DialogTrigger } from '../../shared/dialog';
import { ConfirmChangesDialog } from './components/ConfirmChangesDialog';
import type { PersonalInfoEditViewModel } from '../../../../adapters/presenters/personal-info/personal-info-edit.presenter';

interface PersonalInfoEditProps {
  model: PersonalInfoEditViewModel;
}

/** P3.2 — edit the contact details; "Enregistrer" opens the P3.3 recap. */
export function PersonalInfoEdit({ model }: PersonalInfoEditProps) {
  const labels = i18n.messages.personalInfo.edit;

  return (
    <PageContent className="items-center gap-6">
      <div className="flex w-160 flex-col gap-1.5">
        <h1 className="text-24 font-bold leading-8 text-heading">{labels.title}</h1>
        <p className="text-14 text-muted-foreground">{labels.description}</p>
      </div>
      <Card className="flex w-160 flex-col">
        <PersonalInfoEditForm fields={model.fields} />
        <CardFooter>
          <Button asChild variant="outline">
            <Link to={AppRoutes.personalInfo}>{i18n.messages.common.cancel}</Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-5">{labels.save}</Button>
            </DialogTrigger>
            <ConfirmChangesDialog model={model.confirmation} />
          </Dialog>
        </CardFooter>
      </Card>
    </PageContent>
  );
}
