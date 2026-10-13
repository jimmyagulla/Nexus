import { render, screen } from '@testing-library/react';
import { i18n } from '../../i18n/i18n';
import { EmployeeEnrollmentView } from './EmployeeEnrollmentView';

const model = {
  secretDisplay: 'JBSW Y3DP EHPK 3PXP',
  provisioningUri:
    'otpauth://totp/Nexus:alice?secret=JBSWY3DPEHPK3PXP&issuer=Nexus',
};

describe('EmployeeEnrollmentView', () => {
  it('presents the additional verification step', () => {
    render(<EmployeeEnrollmentView model={model} />);

    expect(
      screen.getByRole('heading', { name: i18n.messages.enrollment.title }),
    ).toBeTruthy();
    expect(screen.getByText(i18n.messages.enrollment.instruction)).toBeTruthy();
  });

  it('shows the key to enter in the authenticator application', () => {
    render(<EmployeeEnrollmentView model={model} />);

    expect(screen.getByText(model.secretDisplay)).toBeTruthy();
  });

  it('offers the setup link of the authenticator application', () => {
    render(<EmployeeEnrollmentView model={model} />);

    const link = screen.getByRole('link', {
      name: i18n.messages.enrollment.uri,
    });
    expect(link.getAttribute('href')).toBe(model.provisioningUri);
  });
});
