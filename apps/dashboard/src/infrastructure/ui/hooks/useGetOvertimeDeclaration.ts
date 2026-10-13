import { useQuery } from '@tanstack/react-query';
import type { OvertimeDeclarationComposition } from '../../composition/overtime-declaration.composition';
import { overtimeDeclarationFixture } from '../fixtures/overtime.fixture';

export const getOvertimeDeclarationQueryKey = () => ['overtime-declaration'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetOvertimeDeclaration({ presenter }: OvertimeDeclarationComposition) {
  return useQuery({
    queryKey: getOvertimeDeclarationQueryKey(),
    queryFn: async () => presenter.present(overtimeDeclarationFixture),
  });
}
