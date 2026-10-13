import { ErrorCode } from '../errors/error-code';
import { RecoveryCode } from './recovery-code';

describe('RecoveryCode', () => {
  it('keeps a ten character code', () => {
    expect(RecoveryCode.parse('ABCDE23456').value).toBe('ABCDE23456');
  });

  it('ignores the dash, the spaces and the case a person types', () => {
    expect(RecoveryCode.parse(' abcde-23456 ').value).toBe('ABCDE23456');
  });

  it('asks for the information when the code is empty', () => {
    expect(() => RecoveryCode.parse('  ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('requires the second factor when the code is not a recovery code', () => {
    expect(() => RecoveryCode.parse('ABCDE')).toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
    expect(() => RecoveryCode.parse('ABCDE1ABCD')).toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
  });
});
