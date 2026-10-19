import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { PersonalContactValues } from '@hexagonal-monorepo-template/domain';
import type { PersonalInfoPageComposition } from '../../../composition/personal-info/personal-info-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetPersonalInfo } from '../../hooks/personal-info/useGetPersonalInfo';
import { useUpdatePersonalContact } from '../../hooks/personal-info/useUpdatePersonalContact';
import { useToast } from '../../hooks/use-toast';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { PersonalInfo } from './PersonalInfo';
import { PersonalInfoEditModal } from './components/PersonalInfoEditModal';

interface PersonalInfoPageProps {
  deps: PersonalInfoPageComposition;
  /** Reached through the edition address: the edition modal opens at once. */
  editRoute?: boolean;
}

export function PersonalInfoPage({ deps, editRoute = false }: PersonalInfoPageProps) {
  const navigate = useNavigate();
  const { successToast } = useToast();
  const personalInfo = useGetPersonalInfo(deps);
  const update = useUpdatePersonalContact(deps);
  const [editOpen, setEditOpen] = useState(editRoute);
  /** Valid values waiting for the recap's "Confirmer". */
  const [reviewed, setReviewed] = useState<PersonalContactValues | null>(null);
  const saved = personalInfo.data?.savedContact;
  const confirmation = useMemo(
    () => (reviewed === null || saved === undefined ? null : deps.editPresenters.changes.present(saved, reviewed)),
    [deps, reviewed, saved],
  );

  const changeEditOpen = (open: boolean) => {
    update.reset();
    setReviewed(null);
    setEditOpen(open);
    if (!open && editRoute) {
      void navigate({ to: AppRoutes.personalInfo, replace: true });
    }
  };

  const review = (values: PersonalContactValues) => {
    if (saved !== undefined && deps.editPresenters.changes.present(saved, values).changes.length === 0) {
      changeEditOpen(false);
      return;
    }
    setReviewed(values);
  };

  const confirm = () => {
    if (reviewed === null) {
      return;
    }
    update.mutate(reviewed, {
      onSuccess: () => {
        successToast(i18n.messages.personalInfo.updated.title);
        changeEditOpen(false);
      },
    });
  };

  if (personalInfo.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (personalInfo.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  const models = personalInfo.data;

  return (
    <>
      <PersonalInfo
        lastUpdate={models.lastUpdate}
        contact={models.contact}
        employer={models.employer}
        onEdit={() => changeEditOpen(true)}
      />
      <PersonalInfoEditModal
        open={editOpen}
        onOpenChange={changeEditOpen}
        fields={models.fields}
        saved={models.savedContact}
        errorPresenter={deps.errorPresenter}
        confirmation={confirmation}
        onReview={review}
        onBack={() => {
          update.reset();
          setReviewed(null);
        }}
        onConfirm={confirm}
        submitting={update.isPending}
        submissionError={update.isError ? deps.errorPresenter.present(update.error) : null}
      />
    </>
  );
}
