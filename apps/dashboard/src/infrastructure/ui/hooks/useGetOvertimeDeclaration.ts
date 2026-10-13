import { useQuery } from '@tanstack/react-query';
import type { OvertimeDeclarationPageComposition } from '../../composition/overtime/overtime-declaration-page.composition';
import { overtimeDeclarationFixture } from '../fixtures/overtime.fixture';

export const getOvertimeDeclarationQueryKey = () => ['overtime-declaration'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetOvertimeDeclaration({ presenter }: OvertimeDeclarationPageComposition) {
  return useQuery({
    queryKey: getOvertimeDeclarationQueryKey(),
    queryFn: async () => presenter.present(overtimeDeclarationFixture),
  });
}
