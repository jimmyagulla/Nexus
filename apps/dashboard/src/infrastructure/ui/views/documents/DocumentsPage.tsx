import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useShallow } from 'zustand/react/shallow';
import type { DocumentsPageComposition } from '../../../composition/document/documents-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useDepositDocuments } from '../../hooks/useDepositDocuments';
import { useDownloadDocument } from '../../hooks/useDownloadDocument';
import { useGetDocuments } from '../../hooks/useGetDocuments';
import { useToast } from '../../hooks/use-toast';
import { useViewDocument } from '../../hooks/useViewDocument';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { useDocumentsListStore } from '../../stores/documents-list.store';
import { Documents } from './Documents';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { saveFile } from '../../../network/document-files';
import type { DocumentsListHandlers } from './components/documents-list.handlers';
import type { DocumentUploadValues } from '../../features/documents/document-upload.schema';

interface DocumentsPageProps {
  deps: DocumentsPageComposition;
  /** Reached through the upload address: the upload modal opens at once. */
  uploadRoute?: boolean;
}

const SEARCH_DEBOUNCE_MS = 250;

export function DocumentsPage({ deps, uploadRoute = false }: DocumentsPageProps) {
  const navigate = useNavigate();
  const { successToast, errorToast } = useToast();
  const list = useDocumentsListStore(
    useShallow(({ search, categories, statuses, emitter, from, to, sort, direction }) => ({
      search, categories, statuses, emitter, from, to, sort, direction,
    })),
  );
  const actions = useDocumentsListStore.getState();
  const search = useDebouncedValue(list.search, SEARCH_DEBOUNCE_MS);
  const documents = useGetDocuments(deps, { ...list, search });
  const deposit = useDepositDocuments(deps);
  const view = useViewDocument(deps);
  const download = useDownloadDocument(deps);
  const uploadModel = useMemo(() => deps.uploadPresenter.present(), [deps]);
  const [uploadOpen, setUploadOpen] = useState(uploadRoute);
  /** Document shown in the in-app viewer. */
  const [previewed, setPreviewed] = useState<{ id: string; name: string } | null>(null);

  const showError = (error: unknown) => errorToast(deps.errorPresenter.present(error));

  const handlers: DocumentsListHandlers = {
    onSearchChange: actions.setSearch,
    onToggleCategory: actions.toggleCategory,
    onToggleStatus: actions.toggleStatus,
    onEmitterChange: actions.setEmitter,
    onFromChange: actions.setFrom,
    onToChange: actions.setTo,
    onCycleSort: actions.cycleSort,
    onRemoveFilter: actions.removeFilter,
    onClearFilters: actions.clearFilters,
    onView: (documentId) => {
      const row = documents.data?.documents.find((document) => document.id === documentId);
      setPreviewed({ id: documentId, name: row?.name ?? '' });
      view.mutate(documentId);
    },
    onDownload: (documentId) => download.mutate(documentId, { onError: showError }),
  };

  const closePreview = () => {
    if (view.data !== undefined) {
      URL.revokeObjectURL(view.data.objectUrl);
    }
    view.reset();
    setPreviewed(null);
  };

  const changeUploadOpen = (open: boolean) => {
    deposit.reset();
    setUploadOpen(open);
    if (!open && uploadRoute) {
      void navigate({ to: AppRoutes.documents, replace: true });
    }
  };

  const submitDeposit = async (values: DocumentUploadValues): Promise<boolean> => {
    try {
      const deposited = await deposit.mutateAsync(values);
      successToast(deps.uploadPresenter.presentDeposited(deposited.length), {
        title: i18n.messages.documents.sent.title,
      });
      return true;
    } catch {
      return false;
    }
  };

  if (documents.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (documents.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return (
    <>
      <Documents
        model={documents.data}
        search={list.search}
        handlers={handlers}
        onUpload={() => changeUploadOpen(true)}
      />
      <DocumentUploadModal
        open={uploadOpen}
        onOpenChange={changeUploadOpen}
        model={uploadModel}
        presenter={deps.uploadPresenter}
        errorPresenter={deps.errorPresenter}
        submitting={deposit.isPending}
        submissionError={deposit.isError ? deps.errorPresenter.present(deposit.error) : null}
        onSubmit={submitDeposit}
      />
      <DocumentPreviewModal
        open={previewed !== null}
        onOpenChange={(open) => (open ? undefined : closePreview())}
        title={view.data?.fileName ?? previewed?.name ?? ''}
        preview={view.data}
        loading={view.isPending}
        error={view.isError ? deps.errorPresenter.present(view.error) : null}
        onDownload={() => {
          if (view.data !== undefined) {
            saveFile(view.data.objectUrl, view.data.fileName);
          }
        }}
      />
    </>
  );
}
