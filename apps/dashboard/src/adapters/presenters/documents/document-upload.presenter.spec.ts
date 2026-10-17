import { DocumentCategory } from '@hexagonal-monorepo-template/domain';
import { DocumentUploadPresenter } from './document-upload.presenter';

describe('DocumentUploadPresenter', () => {
  const presenter = new DocumentUploadPresenter();

  it('states the accepted formats and the largest size from the domain', () => {
    const model = presenter.present();

    expect(model.dropzoneHint).toBe('PDF, JPG, PNG, XLS, XLSX, CSV · 10 Mo max.');
    expect(model.accept.split(',')).toEqual(expect.arrayContaining(['.pdf', '.jpeg', '.xlsx', '.csv', 'application/pdf']));
    expect(model.nameMaxLength).toBe(50);
    expect(model.commentMaxLength).toBe(250);
  });

  it('starts on the sick leave', () => {
    expect(presenter.present().defaultType).toBe(DocumentCategory.SICK_LEAVE);
  });
});
