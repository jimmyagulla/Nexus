import { useQuery } from '@tanstack/react-query';
import type { AccountingFirmUploadPageComposition } from '../../composition/accounting-firm/accounting-firm-upload-page.composition';
import { accountingFirmUploadFixture } from '../fixtures/accounting-firm.fixture';

export const getAccountingFirmUploadQueryKey = () => ['accounting-firm-upload'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetAccountingFirmUpload({ presenter }: AccountingFirmUploadPageComposition) {
  return useQuery({
    queryKey: getAccountingFirmUploadQueryKey(),
    queryFn: async () => presenter.present(accountingFirmUploadFixture),
  });
}
