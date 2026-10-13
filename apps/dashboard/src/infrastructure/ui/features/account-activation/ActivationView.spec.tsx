import { render, screen } from '@testing-library/react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { ActivationView } from './ActivationView';

describe('ActivationView', () => {
  it('offers the secret form before the account is opened', () => {
    render(
      <ActivationView
        opened={false}
        errorPresenter={new ErrorPresenter()}
        submissionError={null}
        onSubmit={async () => undefined}
      />,
    );

    expect(
      screen.getByRole('heading', { name: i18n.messages.activation.title }),
    ).toBeTruthy();
    expect(
      screen.getByLabelText(i18n.messages.activation.secret),
    ).toBeTruthy();
  });

  it('confirms that the workspace is open after activation', () => {
    render(
      <ActivationView
        opened={true}
        errorPresenter={new ErrorPresenter()}
        submissionError={null}
        onSubmit={async () => undefined}
      />,
    );

    expect(screen.getByText(i18n.messages.activation.opened)).toBeTruthy();
    expect(
      screen.queryByLabelText(i18n.messages.activation.secret),
    ).toBeNull();
  });
});
