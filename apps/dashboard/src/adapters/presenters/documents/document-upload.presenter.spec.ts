import { DocumentCategory } from '@hexagonal-monorepo-template/domain';
import { DocumentUploadPresenter } from './document-upload.presenter';

describe('DocumentUploadPresenter', () => {
  const presenter = new DocumentUploadPresenter();

  it('offers the four document types in the order of the mockup', () => {
    expect(presenter.present().types.map((type) => [type.value, type.label])).toEqual([
      [DocumentCategory.SICK_LEAVE, 'Arrêt maladie'],
      [DocumentCategory.PROOF, 'Justificatif'],
      [DocumentCategory.ADMINISTRATIVE, 'Document administratif'],
      [DocumentCategory.OTHER, 'Autre'],
    ]);
  });

  it('states the accepted formats and the largest size from the domain', () => {
    const model = presenter.present();

    expect(model.dropzoneHint).toBe('PDF, JPG, PNG, XLS, XLSX, CSV · 10 Mo max.');
    expect(model.accept.split(',')).toEqual(expect.arrayContaining(['.pdf', '.jpeg', '.xlsx', '.csv', 'application/pdf']));
    expect(model.nameMaxLength).toBe(50);
    expect(model.commentMaxLength).toBe(250);
  });

  it('keeps the sick leave reminder', () => {
    expect(presenter.present().types[0].note).toContain('volet 3');
  });

  it('describes a picked file by its size and kind', () => {
    expect(presenter.presentFile({ name: 'arret.pdf', size: 1_258_291 })).toEqual({
      details: '1,2 Mo · Importé',
      icon: 'ri-file-pdf-2-line',
    });
    expect(presenter.presentFile({ name: 'frais.xlsx', size: 900 }).icon).toBe('ri-file-excel-2-line');
  });

  it('counts the characters of a field', () => {
    expect(presenter.presentCounter(12, 250)).toBe('12/250');
  });

  it('confirms one or several documents', () => {
    expect(presenter.presentDeposited(1)).toBe('Votre document a été transmis au service RH.');
    expect(presenter.presentDeposited(3)).toBe('Vos 3 documents ont été transmis au service RH.');
  });
});
