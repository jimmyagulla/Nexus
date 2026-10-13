import { ErrorCode } from '../errors/error-code';
import { SecondFactorProof } from './second-factor-proof';

describe('SecondFactorProof', () => {
  it('reads a six digit code as the usual code', () => {
    expect(SecondFactorProof.parse(' 123 456 ')).toMatchObject({
      kind: 'CODE',
      value: '123456',
    });
  });

  it('reads a ten character code as a recovery code', () => {
    expect(SecondFactorProof.parse('abcde-23456')).toMatchObject({
      kind: 'RECOVERY_CODE',
      value: 'ABCDE23456',
    });
  });

  it('asks for the information when nothing is typed', () => {
    expect(() => SecondFactorProof.parse('   ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('requires the second factor for anything else', () => {
    expect(() => SecondFactorProof.parse('12345')).toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
    expect(() => SecondFactorProof.parse('hello')).toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
  });
});
