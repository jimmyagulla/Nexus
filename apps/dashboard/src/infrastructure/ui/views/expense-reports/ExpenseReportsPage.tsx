import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useShallow } from 'zustand/react/shallow';
import type { ExpenseReportsPageComposition } from '../../../composition/expense-report/expense-reports-page.composition';
import type { ExpenseReportConfirmationModel } from '../../../../adapters/presenters/expense-reports/expense-report-confirmation.presenter';
import { PageStatus } from '../../common/feedback/PageStatus';
import type { ExpenseReportValues } from '../../features/expense-reports/expense-report.schema';
import { useGetExpenseReports } from '../../hooks/expense-reports/useGetExpenseReports';
import { useReviseExpenseReport } from '../../hooks/expense-reports/useReviseExpenseReport';
import { useSubmitExpenseReport } from '../../hooks/expense-reports/useSubmitExpenseReport';
import { useViewExpenseReportProof } from '../../hooks/expense-reports/useViewExpenseReportProof';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { i18n } from '../../i18n/i18n';
import { saveFile } from '../../lib/save-file';
import { AppRoutes } from '../../routes/app-routes';
import { useExpenseReportsListStore } from '../../stores/expense-reports-list.store';
import { ExpenseReports } from './ExpenseReports';
import { ExpenseReportDetailModal } from './components/ExpenseReportDetailModal';
import { ExpenseReportFormModal } from './components/ExpenseReportFormModal';
import type { ExpenseReportsListHandlers } from './components/expense-reports-list.handlers';

interface ExpenseReportsPageProps {
  deps: ExpenseReportsPageComposition;
  /** Reached through the address of a new report: its form opens at once. */
  newRoute?: boolean;
}

/** The form shown: a new report, or the change of one; null while closed. */
type FormTarget = { expenseReportId: string | null } | null;

const SEARCH_DEBOUNCE_MS = 250;

export function ExpenseReportsPage({ deps, newRoute = false }: ExpenseReportsPageProps) {
  const navigate = useNavigate();
  const list = useExpenseReportsListStore(
    useShallow(({ search, categories, statuses, projects, proofs, from, to, minAmount, maxAmount, sort, direction }) => ({
      search, categories, statuses, projects, proofs, from, to, minAmount, maxAmount, sort, direction,
    })),
  );
  const actions = useExpenseReportsListStore.getState();
  const search = useDebouncedValue(list.search, SEARCH_DEBOUNCE_MS);
  const reports = useGetExpenseReports(deps, { ...list, search });
  const submit = useSubmitExpenseReport(deps);
  const revise = useReviseExpenseReport(deps);
  const proof = useViewExpenseReportProof(deps);
  const [formTarget, setFormTarget] = useState<FormTarget>(newRoute ? { expenseReportId: null } : null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ExpenseReportConfirmationModel | null>(null);

  const listed = reports.data?.list;
  const find = (expenseReportId: string | null) =>
    expenseReportId === null ? undefined : listed?.items.find((item) => item.id === expenseReportId);

  const formModel = useMemo(() => {
    if (formTarget === null || listed === undefined) {
      return null;
    }
    const report = listed.items.find((item) => item.id === formTarget.expenseReportId) ?? null;
    return deps.reportPresenters.form.present(report, listed.projectCounts);
  }, [deps, formTarget, listed]);

  const detailModel = useMemo(() => {
    const report = listed?.items.find((item) => item.id === detailId);
    return report === undefined ? null : deps.reportPresenters.detail.present(report);
  }, [deps, detailId, listed]);

  const handlers: ExpenseReportsListHandlers = {
    onSearchChange: actions.setSearch,
    onToggleCategory: actions.toggleCategory,
    onToggleStatus: actions.toggleStatus,
    onToggleProject: actions.toggleProject,
    onProofChange: actions.setProof,
    onFromChange: actions.setFrom,
    onToChange: actions.setTo,
    onMinAmountChange: actions.setMinAmount,
    onMaxAmountChange: actions.setMaxAmount,
    onCycleSort: actions.cycleSort,
    onRemoveFilter: actions.removeFilter,
    onClearFilters: actions.clearFilters,
    onOpen: (expenseReportId) => {
      setDetailId(expenseReportId);
      proof.reset();
      if (find(expenseReportId)?.proof != null) {
        proof.mutate(expenseReportId);
      }
    },
  };

  const closeDetail = () => {
    if (proof.data !== undefined) {
      URL.revokeObjectURL(proof.data.objectUrl);
    }
    proof.reset();
    setDetailId(null);
  };

  const openForm = (expenseReportId: string | null) => {
    submit.reset();
    revise.reset();
    setFormTarget({ expenseReportId });
  };

  const closeForm = () => {
    setFormTarget(null);
    if (newRoute) {
      void navigate({ to: AppRoutes.expenseReports, replace: true });
    }
  };

  const submitForm = async (values: ExpenseReportValues): Promise<boolean> => {
    const expenseReportId = formTarget?.expenseReportId ?? null;
    try {
      const recorded =
        expenseReportId === null
          ? await submit.mutateAsync(values)
          : await revise.mutateAsync({ expenseReportId, form: values });
      setConfirmation(deps.reportPresenters.confirmation.present(recorded, expenseReportId !== null));
      return true;
    } catch {
      return false;
    }
  };

  const mutation = formTarget?.expenseReportId == null ? submit : revise;

  if (reports.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (reports.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return (
    <>
      <ExpenseReports
        kpis={reports.data.kpis}
        summary={reports.data.summary}
        activeFilters={reports.data.activeFilters}
        filters={reports.data.filters}
        sort={reports.data.sort}
        rows={reports.data.rows}
        search={list.search}
        confirmation={confirmation}
        handlers={handlers}
        onNew={() => openForm(null)}
        onDismissConfirmation={() => setConfirmation(null)}
      />
      <ExpenseReportFormModal
        model={formModel}
        onClose={closeForm}
        presenters={deps.reportPresenters}
        errorPresenter={deps.errorPresenter}
        submitting={mutation.isPending}
        submissionError={mutation.isError ? deps.errorPresenter.present(mutation.error) : null}
        onSubmit={submitForm}
      />
      <ExpenseReportDetailModal
        model={detailModel}
        onClose={closeDetail}
        preview={proof.data}
        previewLoading={proof.isPending}
        previewError={proof.isError ? deps.errorPresenter.present(proof.error) : null}
        onEdit={() => {
          const expenseReportId = detailId;
          closeDetail();
          openForm(expenseReportId);
        }}
        onDownloadProof={() => {
          if (proof.data !== undefined) {
            saveFile(proof.data.objectUrl, proof.data.fileName);
          }
        }}
      />
    </>
  );
}
