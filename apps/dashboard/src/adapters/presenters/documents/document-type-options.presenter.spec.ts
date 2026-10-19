import { DocumentCategory } from '@hexagonal-monorepo-template/domain';
import { DocumentTypeOptionsPresenter } from './document-type-options.presenter';

describe('DocumentTypeOptionsPresenter', () => {
  const presenter = new DocumentTypeOptionsPresenter();

  it('offers the four document types in the order of the mockup', () => {
    expect(presenter.present().map((type) => [type.value, type.label])).toEqual([
      [DocumentCategory.SICK_LEAVE, 'Arrêt maladie'],
      [DocumentCategory.PROOF, 'Justificatif'],
      [DocumentCategory.ADMINISTRATIVE, 'Document administratif'],
      [DocumentCategory.OTHER, 'Autre'],
    ]);
  });

  it('keeps the sick leave reminder', () => {
    expect(presenter.present()[0].note).toContain('volet 3');
  });
});
