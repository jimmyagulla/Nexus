import { saveFile } from './save-file';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('saveFile', () => {
  it('hands the file to the download manager under its name', () => {
    const clicked: { href: string; download: string }[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicked.push({ href: this.href, download: this.download });
    });

    saveFile('blob:http://app/1', 'Arrêt.pdf');

    expect(clicked).toEqual([{ href: 'blob:http://app/1', download: 'Arrêt.pdf' }]);
    expect(document.querySelector('a')).toBeNull();
  });
});
