import { create } from 'zustand';
import type { PayslipsListState } from '../../../adapters/controllers/payslips.controller';

interface PayslipsListStore extends PayslipsListState {
  setYear: (year: number) => void;
}

/** Year of the payslips list; kept while navigating. */
export const usePayslipsListStore = create<PayslipsListStore>((set) => ({
  year: null,
  setYear: (year) => set({ year }),
}));
