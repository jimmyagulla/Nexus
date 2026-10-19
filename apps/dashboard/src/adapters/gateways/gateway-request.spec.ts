import { authorizedBy, joinedParam, optionalParam } from './gateway-request';

describe('joinedParam', () => {
  it('joins the values with commas', () => {
    expect(joinedParam(['SICK_LEAVE', 'PROOF'])).toBe('SICK_LEAVE,PROOF');
  });

  it('leaves the parameter out for an empty list', () => {
    expect(joinedParam([])).toBeUndefined();
  });
});

describe('optionalParam', () => {
  it('keeps a text', () => {
    expect(optionalParam('arrêt')).toBe('arrêt');
  });

  it('leaves the parameter out for an empty text', () => {
    expect(optionalParam('')).toBeUndefined();
  });
});

describe('authorizedBy', () => {
  it('carries the token as a bearer credential', () => {
    expect(authorizedBy('token-1')).toEqual({ headers: { Authorization: 'Bearer token-1' } });
  });
});
