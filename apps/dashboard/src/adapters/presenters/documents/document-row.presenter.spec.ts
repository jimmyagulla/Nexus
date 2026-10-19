import {
  DocumentCategory,
  DocumentEmitter,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import { DocumentRowPresenter } from './document-row.presenter';
import { FileSizePresenter } from './file-size.presenter';

describe('DocumentRowPresenter', () => {
  const presenter = new DocumentRowPresenter(new FileSizePresenter());

  it('presents a document as a row of the table', () => {
    expect(
      presenter.present({
        id: 'd1', name: 'Arrêt du 2 octobre', category: DocumentCategory.SICK_LEAVE, status: DocumentStatus.PENDING,
        format: 'PDF', sizeBytes: 192_512, emitter: DocumentEmitter.SELF, comment: null, createdAt: '2026-10-03T10:24:00.000Z',
      }),
    ).toEqual({
      id: 'd1', icon: 'ri-first-aid-kit-line', name: 'Arrêt du 2 octobre', category: 'Arrêt maladie', date: '03/10/2026',
      format: 'PDF', size: '188 Ko', emitter: 'Vous', status: { label: 'En attente de prise en compte', tone: 'warning' },
    });
  });

  it('names the emitter and the tone of the status', () => {
    const row = presenter.present({
      id: 'd2', name: 'Notice', category: DocumentCategory.ADMINISTRATIVE, status: DocumentStatus.NEW,
      format: 'JPEG', sizeBytes: 1_468_006, emitter: DocumentEmitter.HR, comment: null, createdAt: '2026-01-05T09:00:00.000Z',
    });

    expect(row).toMatchObject({ icon: 'ri-file-text-line', format: 'JPG', size: '1,4 Mo', emitter: 'Service RH' });
    expect(row.status).toEqual({ label: 'Nouveau', tone: 'info' });
  });
});
