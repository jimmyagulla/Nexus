import { assertCompanyCreationAllowed } from '../services/assert-company-creation-allowed';
import { UserRole } from './user-role';
import { toActorContext } from './to-actor-context';

describe('toActorContext', () => {
  it('reads the company and the role from the identity claims', () => {
    expect(
      toActorContext('user-1', { company_id: 'c1', role: UserRole.EMPLOYER }),
    ).toEqual({
      userId: 'user-1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    });
  });

  it('leaves the company empty when the claim is missing', () => {
    expect(toActorContext('user-1', {})).toEqual({
      userId: 'user-1',
      companyId: null,
      role: null,
    });
  });

  it('reads a company claim surrounded by spaces', () => {
    expect(toActorContext('user-1', { company_id: '  c1  ' }).companyId).toBe(
      'c1',
    );
  });

  it('ignores a company claim that is not a string', () => {
    expect(toActorContext('user-1', { company_id: 42 }).companyId).toBeNull();
    expect(toActorContext('user-1', { company_id: null }).companyId).toBeNull();
    expect(toActorContext('user-1', { company_id: false }).companyId).toBeNull();
    expect(toActorContext('user-1', { company_id: ['c1'] }).companyId).toBeNull();
    expect(
      toActorContext('user-1', { company_id: { value: 'c1' } }).companyId,
    ).toBeNull();
  });

  it('leaves the company empty when the claim carries no company', () => {
    expect(toActorContext('user-1', { company_id: '' }).companyId).toBeNull();
    expect(toActorContext('user-1', { company_id: '   ' }).companyId).toBeNull();
    expect(
      toActorContext('user-1', { company_id: '\n\t' }).companyId,
    ).toBeNull();
  });

  it('ignores a role outside the known roles', () => {
    expect(toActorContext('user-1', { role: 'ADMIN' }).role).toBeNull();
  });

  it('reads a role claim surrounded by spaces', () => {
    expect(toActorContext('user-1', { role: '  EMPLOYER  ' }).role).toBe(
      UserRole.EMPLOYER,
    );
  });

  it('leaves the role empty when the claim carries no role', () => {
    expect(toActorContext('user-1', { role: '' }).role).toBeNull();
    expect(toActorContext('user-1', { role: '   ' }).role).toBeNull();
  });

  it('ignores a role claim that is not a string', () => {
    expect(toActorContext('user-1', { role: ['EMPLOYER'] }).role).toBeNull();
    expect(toActorContext('user-1', { role: null }).role).toBeNull();
  });

  it('ignores claims the identity provider does not name', () => {
    expect(
      toActorContext('user-1', { companyId: 'c1', userRole: 'EMPLOYER' }),
    ).toEqual({ userId: 'user-1', companyId: null, role: null });
  });

  it('leaves an actor free to create a company when the claim carries no company', () => {
    expect(() =>
      assertCompanyCreationAllowed(toActorContext('user-1', { company_id: '' })),
    ).not.toThrow();
  });
});
