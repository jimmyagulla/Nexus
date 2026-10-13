import { describe, expect, it } from 'vitest';
import { EuroPresenter } from './euro.presenter';

function plain(text: string): string {
  return text.replace(/\s/g, ' ');
}

describe('EuroPresenter', () => {
  it('writes a whole amount without cents', () => {
    expect(plain(new EuroPresenter().present(125))).toBe('125 €');
  });

  it('writes an amount with cents on two decimals', () => {
    expect(plain(new EuroPresenter().present(12.5))).toBe('12,50 €');
  });

  it('groups the thousands', () => {
    expect(plain(new EuroPresenter().present(1234.56))).toBe('1 234,56 €');
  });

  it('writes zero as zero euros', () => {
    expect(plain(new EuroPresenter().present(0))).toBe('0 €');
  });
});
