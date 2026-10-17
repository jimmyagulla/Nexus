import { CountLabelPresenter } from './count-label.presenter';

const forms = { one: '{count} filtre', other: '{count} filtres', none: 'Aucun filtre' };

describe('CountLabelPresenter', () => {
  const presenter = new CountLabelPresenter();

  it('uses the wording of none when there is one', () => {
    expect(presenter.present(0, forms)).toBe('Aucun filtre');
  });

  it('falls back on the plural for zero without a wording of none', () => {
    expect(presenter.present(0, { one: forms.one, other: forms.other })).toBe('0 filtres');
  });

  it('tells one from several', () => {
    expect(presenter.present(1, forms)).toBe('1 filtre');
    expect(presenter.present(3, forms)).toBe('3 filtres');
  });
});
