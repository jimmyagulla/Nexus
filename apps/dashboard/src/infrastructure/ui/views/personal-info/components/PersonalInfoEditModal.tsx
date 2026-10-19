import type { PersonalContactValues } from '@hexagonal-monorepo-template/domain';
import {
  PERSONAL_INFO_EDIT_FORM_ID,
  PersonalInfoEditForm,
} from '../../../features/personal-info/PersonalInfoEditForm';
import { Dialog, ModalContent } from '../../../shared/dialog';
import { PersonalInfoEdit } from '../PersonalInfoEdit';
import { ConfirmChangesDialog } from './ConfirmChangesDialog';
import type { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import type { ConfirmChangesModel } from '../../../../../adapters/presenters/personal-info/confirm-changes.presenter';
import type { ContactFieldModel } from '../../../../../adapters/presenters/personal-info/contact-fields.presenter';

interface PersonalInfoEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: ContactFieldModel[];
  saved: PersonalContactValues;
  errorPresenter: ErrorPresenter;
  /** The recap of the submitted changes; null while the employee edits. */
  confirmation: ConfirmChangesModel | null;
  /** "Enregistrer" with valid values. */
  onReview: (values: PersonalContactValues) => void;
  /** "Revenir": back to the fields, as they were typed. */
  onBack: () => void;
  onConfirm: () => void;
  submitting: boolean;
  submissionError: string | null;
}

/**
 * The contact details edition, in a modal over the personal information; the
 * P3.3 recap opens over it. Closing the modal unmounts the form, so that it
 * forgets what was typed in it.
 */
export function PersonalInfoEditModal({
  open,
  onOpenChange,
  fields,
  saved,
  errorPresenter,
  confirmation,
  onReview,
  onBack,
  onConfirm,
  submitting,
  submissionError,
}: PersonalInfoEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => (submitting ? undefined : onOpenChange(next))}>
      <ModalContent className="w-160">
        <PersonalInfoEdit formId={PERSONAL_INFO_EDIT_FORM_ID}>
          <PersonalInfoEditForm
            fields={fields}
            saved={saved}
            errorPresenter={errorPresenter}
            onSubmit={onReview}
          />
        </PersonalInfoEdit>
        <Dialog
          open={confirmation !== null}
          onOpenChange={(next) => (next || submitting ? undefined : onBack())}
        >
          {confirmation !== null && (
            <ConfirmChangesDialog
              model={confirmation}
              submitting={submitting}
              submissionError={submissionError}
              onConfirm={onConfirm}
            />
          )}
        </Dialog>
      </ModalContent>
    </Dialog>
  );
}
