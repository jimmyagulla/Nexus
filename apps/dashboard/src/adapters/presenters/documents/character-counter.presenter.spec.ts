import { CharacterCounterPresenter } from './character-counter.presenter';

describe('CharacterCounterPresenter', () => {
  it('counts the characters of a field against its limit', () => {
    expect(new CharacterCounterPresenter().present(12, 250)).toBe('12/250');
  });
});
