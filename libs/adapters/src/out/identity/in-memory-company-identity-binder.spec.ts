import { describe, expect, it } from 'vitest';
import { InMemoryCompanyIdentityBinder } from './in-memory-company-identity-binder';

describe('InMemoryCompanyIdentityBinder', () => {
  it('starts without any binding', () => {
    const identity = new InMemoryCompanyIdentityBinder();

    expect(identity.bindings.size).toBe(0);
  });

  it('binds an employer to its company', async () => {
    const identity = new InMemoryCompanyIdentityBinder();

    await identity.bindEmployer('user-1', 'c1');

    expect(identity.bindings.get('user-1')).toBe('c1');
  });

  it('rebinds a user to another company', async () => {
    const identity = new InMemoryCompanyIdentityBinder();

    await identity.bindEmployer('user-1', 'c1');
    await identity.bindEmployer('user-1', 'c2');

    expect(identity.bindings.get('user-1')).toBe('c2');
    expect(identity.bindings.size).toBe(1);
  });

  it('keeps the bindings of two users apart', async () => {
    const identity = new InMemoryCompanyIdentityBinder();

    await identity.bindEmployer('user-1', 'c1');
    await identity.bindEmployer('user-2', 'c2');

    expect(identity.bindings.get('user-1')).toBe('c1');
    expect(identity.bindings.get('user-2')).toBe('c2');
  });

  it('leaves a user that was never bound unknown', async () => {
    const identity = new InMemoryCompanyIdentityBinder();

    await identity.bindEmployer('user-1', 'c1');

    expect(identity.bindings.get('user-2')).toBeUndefined();
  });

  it('keeps two binders on independent bindings', async () => {
    const identity = new InMemoryCompanyIdentityBinder();
    const other = new InMemoryCompanyIdentityBinder();

    await identity.bindEmployer('user-1', 'c1');

    expect(other.bindings.size).toBe(0);
  });
});
