import { useQuery } from '@tanstack/react-query';
import type { AccountingFirmPageComposition } from '../../composition/accounting-firm/accounting-firm-page.composition';
import { accountingFirmFixture } from '../fixtures/accounting-firm.fixture';

export const getAccountingFirmQueryKey = () => ['accounting-firm'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetAccountingFirm({ presenter }: AccountingFirmPageComposition) {
  return useQuery({
    queryKey: getAccountingFirmQueryKey(),
    queryFn: async () => presenter.present(accountingFirmFixture),
  });
}
