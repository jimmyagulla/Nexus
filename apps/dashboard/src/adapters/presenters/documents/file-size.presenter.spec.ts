import { FileSizePresenter } from './file-size.presenter';

describe('FileSizePresenter', () => {
  const presenter = new FileSizePresenter();

  it('keeps a few bytes as bytes', () => {
    expect(presenter.present(512)).toBe('512 o');
  });

  it('rounds kilobytes', () => {
    expect(presenter.present(192_512)).toBe('188 Ko');
  });

  it('writes megabytes with one decimal at most, with a comma', () => {
    expect(presenter.present(1_468_006)).toBe('1,4 Mo');
    expect(presenter.present(2 * 1024 * 1024)).toBe('2 Mo');
  });
});
