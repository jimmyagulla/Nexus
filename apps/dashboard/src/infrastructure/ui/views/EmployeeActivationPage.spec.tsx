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
      data: null,
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
