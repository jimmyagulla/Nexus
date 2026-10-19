import {
  EXPENSE_REPORT_FORM_ID,
  ExpenseReportForm,
} from '../../../features/expense-reports/ExpenseReportForm';
import type { ExpenseReportValues } from '../../../features/expense-reports/expense-report.schema';
import { Dialog, ModalContent } from '../../../shared/dialog';
import { ExpenseReportEditor } from '../ExpenseReportEditor';
import type { ExpenseReportPresenters } from '../../../../composition/expense-report/expense-reports-page.composition';
import type { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import type { ExpenseReportFormModel } from '../../../../../adapters/presenters/expense-reports/expense-report-form.presenter';

interface ExpenseReportFormModalProps {
  /** The form to show; the modal is closed without one. */
  model: ExpenseReportFormModel | null;
  onClose: () => void;
  presenters: Pick<ExpenseReportPresenters, 'vatOptions' | 'uploadedFile' | 'counter'>;
  errorPresenter: ErrorPresenter;
  submitting: boolean;
  submissionError: string | null;
  /** Resolves true once the report is recorded. */
  onSubmit: (values: ExpenseReportValues) => Promise<boolean>;
}

/**
 * The expense report form, in a large modal over the list. Closing the modal
 * unmounts the form, so that it forgets what was typed in it.
 */
export function ExpenseReportFormModal({
  model,
  onClose,
  presenters,
  errorPresenter,
  submitting,
  submissionError,
  onSubmit,
}: ExpenseReportFormModalProps) {
  return (
    <Dialog
      open={model !== null}
      onOpenChange={(open) => (open || submitting ? undefined : onClose())}
    >
      <ModalContent className="w-200">
        {model !== null && (
          <ExpenseReportEditor
            title={model.title}
            intro={model.intro}
            submitLabel={model.submitLabel}
            submitIcon={model.submitIcon}
            formId={EXPENSE_REPORT_FORM_ID}
            submitting={submitting}
            submissionError={submissionError}
          >
            <ExpenseReportForm
              model={model}
              vatOptionsPresenter={presenters.vatOptions}
              uploadedFilePresenter={presenters.uploadedFile}
              counterPresenter={presenters.counter}
              errorPresenter={errorPresenter}
              submitting={submitting}
              onSubmit={async (values) => {
                if (await onSubmit(values)) {
                  onClose();
                }
              }}
            />
          </ExpenseReportEditor>
        )}
      </ModalContent>
    </Dialog>
  );
}
