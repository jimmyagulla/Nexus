import { FileSizePresenter } from './file-size.presenter';
import { UploadedFilePresenter } from './uploaded-file.presenter';

describe('UploadedFilePresenter', () => {
  const presenter = new UploadedFilePresenter(new FileSizePresenter());

  it('describes a picked file by its size and kind', () => {
    expect(presenter.present({ name: 'arret.pdf', size: 1_258_291 })).toEqual({
      details: '1,2 Mo · Importé',
      icon: 'ri-file-pdf-2-line',
    });
    expect(presenter.present({ name: 'frais.xlsx', size: 900 }).icon).toBe('ri-file-excel-2-line');
  });

  it('falls back on a plain file icon for an unknown kind', () => {
    expect(presenter.present({ name: 'notes.txt', size: 10 }).icon).toBe('ri-file-line');
  });
});
