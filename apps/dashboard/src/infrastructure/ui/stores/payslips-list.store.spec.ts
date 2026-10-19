import { usePayslipsListStore } from './payslips-list.store';

const initial = usePayslipsListStore.getState();

beforeEach(() => {
  usePayslipsListStore.setState(initial, true);
});

describe('payslips list store', () => {
  it('starts without a chosen year', () => {
    expect(usePayslipsListStore.getState().year).toBeNull();
  });

  it('keeps the chosen year', () => {
    usePayslipsListStore.getState().setYear(2024);

    expect(usePayslipsListStore.getState().year).toBe(2024);
  });
});
