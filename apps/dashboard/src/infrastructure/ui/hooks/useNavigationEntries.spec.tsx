import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InMemorySessionGateway } from '@hexagonal-monorepo-template/adapters';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { createNavigationComposition } from '../../composition/navigation.composition';
import { useNavigationEntries } from './useNavigationEntries';

function render(role: UserRole | null) {
  const deps = createNavigationComposition(
    new InMemorySessionGateway(
      'jwt',
      role === null ? null : { userId: 'u1', companyId: 'c1', role },
    ),
  );
  return renderHook(() => useNavigationEntries(deps), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    ),
  });
}

describe('useNavigationEntries', () => {
  it('gives the entries of the cabinet to the cabinet', async () => {
    const { result } = render(UserRole.ACCOUNTANT);

    await waitFor(() =>
      expect(result.current.map((entry) => entry.id)).toEqual([
        'receivedDocuments',
      ]),
    );
  });

  it('gives the entries of the company to its employer', async () => {
    const { result } = render(UserRole.EMPLOYER);

    await waitFor(() =>
      expect(result.current.map((entry) => entry.id)).toEqual([
        'dashboard',
        'settings',
        'cabinet',
      ]),
    );
  });

  it('gives no entry until the role is known', () => {
    const { result } = render(UserRole.EMPLOYER);

    expect(result.current).toEqual([]);
  });
});
