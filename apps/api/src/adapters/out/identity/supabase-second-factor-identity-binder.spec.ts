import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SupabaseSecondFactorIdentityBinder } from './supabase-second-factor-identity-binder';

type UpdateAttributes = { app_metadata: Record<string, unknown> };

const updateUserById = vi.hoisted(() =>
  vi.fn<
    (userId: string, attributes: UpdateAttributes) => Promise<{
      error: Error | null;
    }>
  >(),
);

type SupabaseAdminStub = {
  auth: { admin: { updateUserById: typeof updateUserById } };
};

const createSupabaseAdmin = vi.hoisted(() =>
  vi.fn<
    (config: { url: string; serviceRoleKey: string }) => SupabaseAdminStub
  >(),
);

vi.mock('@hexagonal-monorepo-template/infrastructure/supabase/server', () => ({
  createSupabaseAdmin,
}));

const config = {
  url: 'https://project.supabase.co',
  serviceRoleKey: 'service-role-key',
};

describe('SupabaseSecondFactorIdentityBinder', () => {
  beforeEach(() => {
    createSupabaseAdmin.mockReset();
    createSupabaseAdmin.mockReturnValue({
      auth: { admin: { updateUserById } },
    });
    updateUserById.mockReset();
    updateUserById.mockResolvedValue({ error: null });
  });

  it('marks the second factor of the user as verified', async () => {
    await new SupabaseSecondFactorIdentityBinder(config).markVerified('user-1');

    expect(updateUserById).toHaveBeenCalledWith('user-1', {
      app_metadata: { second_factor_verified: true },
    });
  });

  it('clears the verification of the user', async () => {
    await new SupabaseSecondFactorIdentityBinder(config).clearVerified(
      'user-1',
    );

    expect(updateUserById).toHaveBeenCalledWith('user-1', {
      app_metadata: { second_factor_verified: false },
    });
  });

  it('talks to the identity provider described by the configuration', () => {
    new SupabaseSecondFactorIdentityBinder(config);

    expect(createSupabaseAdmin).toHaveBeenCalledWith(config);
  });

  it('propagates the failure reported by the identity provider', async () => {
    const failure = new Error('user not found');
    updateUserById.mockResolvedValue({ error: failure });

    await expect(
      new SupabaseSecondFactorIdentityBinder(config).markVerified('user-1'),
    ).rejects.toBe(failure);
  });
});
