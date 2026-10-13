import { ErrorCode } from '../errors/error-code';
import { SecondFactor } from './second-factor';

describe('SecondFactor', () => {
  it('starts an enrollment that is not finished', () => {
    const factor = SecondFactor.begin('u1', 'c1', 'SECRET');

    expect(factor).toMatchObject({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
    });
    expect(factor.isEnrolled()).toBe(false);
    expect(factor.recoveryCodeDigests).toEqual([]);
  });

  it('is enrolled once the enrollment is confirmed', () => {
    const factor = SecondFactor.begin('u1', 'c1', 'SECRET').confirm([]);

    expect(factor.isEnrolled()).toBe(true);
    expect(factor.secret).toBe('SECRET');
  });

  it('keeps the recovery codes it is confirmed with', () => {
    const factor = SecondFactor.begin('u1', 'c1', 'SECRET').confirm(['a', 'b']);

    expect(factor.recoveryCodeDigests).toEqual(['a', 'b']);
  });

  it('refuses to confirm an enrollment twice', () => {
    const enrolled = SecondFactor.begin('u1', 'c1', 'SECRET').confirm([]);

    expect(() => enrolled.confirm([])).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('spends a recovery code once', () => {
    const factor = SecondFactor.begin('u1', 'c1', 'SECRET').confirm(['a', 'b']);

    const spent = factor.consumeRecoveryCode('a');

    expect(spent.recoveryCodeDigests).toEqual(['b']);
    expect(spent.isEnrolled()).toBe(true);
    expect(() => spent.consumeRecoveryCode('a')).toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
  });

  it('refuses a recovery code it never issued', () => {
    const factor = SecondFactor.begin('u1', 'c1', 'SECRET').confirm(['a']);

    expect(() => factor.consumeRecoveryCode('z')).toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
  });
});

describe('SecondFactor.restore', () => {
  it('rebuilds a stored second factor as it was saved', () => {
    const pending = SecondFactor.restore({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
      enrolled: false,
      recoveryCodeDigests: [],
    });
    const enrolled = SecondFactor.restore({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
      enrolled: true,
      recoveryCodeDigests: ['a'],
    });

    expect(pending.isEnrolled()).toBe(false);
    expect(enrolled.isEnrolled()).toBe(true);
    expect(enrolled.recoveryCodeDigests).toEqual(['a']);
  });
});
