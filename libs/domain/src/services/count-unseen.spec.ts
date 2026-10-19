import { countUnseen } from './count-unseen';

describe('countUnseen', () => {
  it('counts the items neither opened nor downloaded', () => {
    expect(countUnseen([{ id: 'a' }, { id: 'b' }, { id: 'c' }], new Set(['b', 'z']))).toBe(2);
  });

  it('counts nothing once every item was seen', () => {
    expect(countUnseen([{ id: 'a' }], new Set(['a']))).toBe(0);
  });
});
