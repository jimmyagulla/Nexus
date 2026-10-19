import { PayslipArchiveNamePresenter } from './payslip-archive-name.presenter';

describe('PayslipArchiveNamePresenter', () => {
  it('names the archive after its year', () => {
    expect(new PayslipArchiveNamePresenter().present(2026)).toBe('Bulletins_2026.zip');
  });
});
