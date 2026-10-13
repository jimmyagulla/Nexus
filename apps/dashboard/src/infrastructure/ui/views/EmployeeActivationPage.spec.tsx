import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InMemoryHttpClient } from '@hexagonal-monorepo-template/adapters';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { createAccountComposition } from '../../composition/account.composition';
import { i18n } from '../i18n/i18n';
import { EmployeeActivationPage } from './EmployeeActivationPage';

function renderPage(http: InMemoryHttpClient) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <EmployeeActivationPage
        invitationToken="invite-1"
        deps={createAccountComposition(http)}
      />
    </QueryClientProvider>,
  );
}

function chooseSecret(secret: string) {
  fireEvent.change(screen.getByLabelText(i18n.messages.activation.secret), {
    target: { value: secret },
  });
  fireEvent.click(
    screen.getByRole('button', { name: i18n.messages.activation.submit }),
  );
}

describe('EmployeeActivationPage', () => {
  it('asks the employee to choose a secret', () => {
    renderPage(new InMemoryHttpClient());

    expect(
      screen.getByRole('heading', { name: i18n.messages.activation.title }),
    ).toBeTruthy();
    expect(
      screen.getByLabelText(i18n.messages.activation.secret),
    ).toBeTruthy();
  });

  it('hands the invitation and the chosen secret to the employee route', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/employee-activation', {
      status: 201,
      data: {
        enrollmentId: 'enrollment-1',
        secret: 'JBSWY3DPEHPK3PXP',
        provisioningUri:
          'otpauth://totp/Nexus:alice?secret=JBSWY3DPEHPK3PXP&issuer=Nexus',
      },
    });
    renderPage(http);

    chooseSecret('s3cret');

    await waitFor(() => expect(http.calls).toHaveLength(1));
    expect(http.calls[0]?.url).toBe('accounts/employee-activation');
    expect(http.calls[0]?.data).toEqual({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });
  });

  it('chains the second factor enrollment as soon as the secret is chosen', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/employee-activation', {
      status: 201,
      data: {
        enrollmentId: 'enrollment-1',
        secret: 'JBSWY3DPEHPK3PXP',
        provisioningUri:
          'otpauth://totp/Nexus:alice?secret=JBSWY3DPEHPK3PXP&issuer=Nexus',
      },
    });
    renderPage(http);

    chooseSecret('s3cret');

    expect(
      await screen.findByRole('heading', {
        name: i18n.messages.enrollment.title,
      }),
    ).toBeTruthy();
    expect(screen.getByText('JBSW Y3DP EHPK 3PXP')).toBeTruthy();
    expect(screen.queryByLabelText(i18n.messages.activation.secret)).toBeNull();
  });

  it('does not offer the enrollment when the activation is refused', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'accounts/employee-activation',
      new Error(ErrorCode.INVITATION_INVALID),
    );
    renderPage(http);

    chooseSecret('s3cret');

    await screen.findByText(i18n.messages.errors[ErrorCode.INVITATION_INVALID]);
    expect(
      screen.queryByRole('heading', { name: i18n.messages.enrollment.title }),
    ).toBeNull();
  });

  it('tells the employee the link is no longer usable when the invitation is consumed', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'accounts/employee-activation',
      new Error(ErrorCode.INVITATION_INVALID),
    );
    renderPage(http);

    chooseSecret('s3cret');

    expect(
      await screen.findByText(
        i18n.messages.errors[ErrorCode.INVITATION_INVALID],
      ),
    ).toBeTruthy();
  });
});
