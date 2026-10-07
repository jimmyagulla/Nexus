import { ErrorCode } from '../errors/error-code';
import { assertSameCompany } from './tenant-access';

describe('assertSameCompany', () => {
  it('allows an actor of the same company', () => {
    expect(() => assertSameCompany('a', 'a')).not.toThrow();
  });

  it('refuses another company the same way as a missing company', () => {
    expect(() => assertSameCompany('a', 'b')).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => assertSameCompany('a', null)).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
