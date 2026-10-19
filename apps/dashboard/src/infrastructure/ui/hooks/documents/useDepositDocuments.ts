import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DocumentDepositForm } from '../../../../adapters/controllers/documents.controller';
import type { DocumentsPageComposition } from '../../../composition/document/documents-page.composition';
import { getDocumentsQueryKey } from './useGetDocuments';

export function useDepositDocuments({ controller }: DocumentsPageComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: DocumentDepositForm) => controller.depositDocuments(form),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getDocumentsQueryKey() }),
  });
}
