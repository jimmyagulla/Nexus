import { ErrorCode } from '../errors/error-code';
import { SecondFactorCode } from './second-factor-code';

describe('SecondFactorCode', () => {
  it('keeps a six digit code', () => {
    expect(SecondFactorCode.parse('123456').value).toBe('123456');
  });

  it('keeps a code written with a space between its halves', () => {
    expect(SecondFactorCode.parse(' 123 456 ').value).toBe('123456');
  });

  it('asks for the information when the code is empty', () => {
    expect(() => SecondFactorCode.parse('')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(() => SecondFactorCode.parse('   ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('requires the second factor when the code is not six digits', () => {
    expect(() => SecondFactorCode.parse('12345')).toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
    expect(() => SecondFactorCode.parse('1234567')).toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
    expect(() => SecondFactorCode.parse('12345a')).toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
  });
});
