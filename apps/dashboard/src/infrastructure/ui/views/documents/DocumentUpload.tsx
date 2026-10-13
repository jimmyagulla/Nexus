import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { DocumentUploadForm } from '../../features/documents/DocumentUploadForm';
import { MobileDocumentUploadForm } from '../../features/documents/MobileDocumentUploadForm';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Card, CardFooter } from '../../shared/card';
import type { DocumentUploadViewModel } from '../../../../adapters/presenters/documents/document-upload.presenter';

interface DocumentUploadProps {
  model: DocumentUploadViewModel;
}

/** P2.2 — upload a document to HR (desktop), M.3 below `md`. */
export function DocumentUpload({ model }: DocumentUploadProps) {
  const labels = i18n.messages.documents.upload;

  return (
    <>
      <PageContent className="hidden items-center md:flex md:pb-5.5 md:pt-6">
        <PageHeader
          size="form"
          title={labels.title}
          description={labels.description}
          className="w-190"
        />
        <Card className="flex w-190 flex-col">
          <DocumentUploadForm model={model.form} />
          <CardFooter>
            <Button asChild variant="outline">
              <Link to={AppRoutes.documents}>{i18n.messages.common.cancel}</Link>
            </Button>
            <Button asChild className="px-5">
              <Link to={AppRoutes.documentSent}>
                <i aria-hidden className="ri-send-plane-line" />
                {labels.submit}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </PageContent>
      <div className="flex flex-1 flex-col md:hidden">
        <div className="flex-1 p-5">
          <MobileDocumentUploadForm model={model.mobileForm} />
        </div>
        <div className="border-t border-border bg-card px-5 pb-7 pt-3">
          <Button asChild className="h-13 w-full text-16">
            <Link to={AppRoutes.documentSent}>
              <i aria-hidden className="ri-send-plane-line" />
              {labels.submit}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
