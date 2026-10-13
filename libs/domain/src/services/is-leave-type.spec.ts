import { isLeaveType } from './is-leave-type';

describe('isLeaveType', () => {
  it('files paid leave among the leaves', () => {
    expect(isLeaveType('Congés payés')).toBe(true);
  });

  it('files RTT among the leaves', () => {
    expect(isLeaveType('RTT')).toBe(true);
  });

  it('files an exceptional absence among the absences', () => {
    expect(isLeaveType('Absence exceptionnelle')).toBe(false);
  });

  it('files the other type among the absences', () => {
    expect(isLeaveType('Autre')).toBe(false);
  });

  it('files a type the company added among the absences', () => {
    expect(isLeaveType('Congé parental')).toBe(false);
  });

  it('ignores the case and the spaces around the type', () => {
    expect(isLeaveType('  congés payés ')).toBe(true);
    expect(isLeaveType('rtt')).toBe(true);
  });
});
