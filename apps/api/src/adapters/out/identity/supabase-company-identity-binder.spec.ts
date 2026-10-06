import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { SupabaseCompanyIdentityBinder } from './supabase-company-identity-binder';

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

describe('SupabaseCompanyIdentityBinder', () => {
  beforeEach(() => {
    createSupabaseAdmin.mockReset();
    createSupabaseAdmin.mockReturnValue({
      auth: { admin: { updateUserById } },
    });
    updateUserById.mockReset();
    updateUserById.mockResolvedValue({ error: null });
  });

  it('binds the user to the company as an employer', async () => {
    await new SupabaseCompanyIdentityBinder(config).bindEmployer(
      'user-1',
      'company-1',
    );

    expect(updateUserById).toHaveBeenCalledWith('user-1', {
      app_metadata: { company_id: 'company-1', role: UserRole.EMPLOYER },
    });
  });

  it('talks to the identity provider described by the configuration', () => {
    new SupabaseCompanyIdentityBinder(config);

    expect(createSupabaseAdmin).toHaveBeenCalledWith(config);
  });

  it('propagates the failure reported by the identity provider', async () => {
    const failure = new Error('user not found');
    updateUserById.mockResolvedValue({ error: failure });

    await expect(
      new SupabaseCompanyIdentityBinder(config).bindEmployer(
        'user-1',
        'company-1',
      ),
    ).rejects.toBe(failure);
  });
});
