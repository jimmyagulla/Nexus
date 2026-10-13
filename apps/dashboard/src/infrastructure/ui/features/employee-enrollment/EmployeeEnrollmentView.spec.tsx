import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { EmployeeEnrollmentView } from './EmployeeEnrollmentView';

const model = {
  secretDisplay: 'JBSW Y3DP EHPK 3PXP',
  provisioningUri:
    'otpauth://totp/Nexus:alice?secret=JBSWY3DPEHPK3PXP&issuer=Nexus',
};

function renderView(
  onSubmit: (code: string) => Promise<void> = async () => undefined,
  submissionError: string | null = null,
) {
  render(
    <EmployeeEnrollmentView
      model={model}
      errorPresenter={new ErrorPresenter()}
      submissionError={submissionError}
      onSubmit={onSubmit}
    />,
  );
}

describe('EmployeeEnrollmentView', () => {
  it('presents the additional verification step', () => {
    renderView();

    expect(
      screen.getByRole('heading', { name: i18n.messages.enrollment.title }),
    ).toBeTruthy();
    expect(screen.getByText(i18n.messages.enrollment.instruction)).toBeTruthy();
  });

  it('shows the key to enter in the authenticator application', () => {
    renderView();

    expect(screen.getByText(model.secretDisplay)).toBeTruthy();
  });

  it('offers the setup link of the authenticator application', () => {
    renderView();

    const link = screen.getByRole('link', {
      name: i18n.messages.enrollment.uri,
    });
    expect(link.getAttribute('href')).toBe(model.provisioningUri);
  });

  it('asks for the code of the authenticator application and hands it over', async () => {
    const submitted: string[] = [];
    renderView(async (code) => {
      submitted.push(code);
    });

    fireEvent.change(screen.getByLabelText(i18n.messages.enrollment.code), {
      target: { value: '287082' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.enrollment.submit }),
    );

    await waitFor(() => expect(submitted).toEqual(['287082']));
  });

  it('shows the refusal of the server below the code', () => {
    renderView(async () => undefined, i18n.messages.errors.ACCESS_DENIED);

    expect(screen.getByText(i18n.messages.errors.ACCESS_DENIED)).toBeTruthy();
  });
});
