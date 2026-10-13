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
  });

  it('is enrolled once the enrollment is confirmed', () => {
    const factor = SecondFactor.begin('u1', 'c1', 'SECRET').confirm();

    expect(factor.isEnrolled()).toBe(true);
    expect(factor.secret).toBe('SECRET');
  });

  it('refuses to confirm an enrollment twice', () => {
    const enrolled = SecondFactor.begin('u1', 'c1', 'SECRET').confirm();

    expect(() => enrolled.confirm()).toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('SecondFactor.restore', () => {
  it('rebuilds a stored second factor as it was saved', () => {
    const pending = SecondFactor.restore({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
      enrolled: false,
    });
    const enrolled = SecondFactor.restore({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
      enrolled: true,
    });

    expect(pending.isEnrolled()).toBe(false);
    expect(enrolled.isEnrolled()).toBe(true);
  });
});
