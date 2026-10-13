import { render, screen } from '@testing-library/react';
import { ErrorPresenter } from '../../../../adapters/presenters/error.presenter';
import { i18n } from '../../i18n/i18n';
import { SignInView } from './SignInView';

describe('SignInView', () => {
  it('offers identifier and secret on the sign-in screen', () => {
    render(
      <SignInView
        errorPresenter={new ErrorPresenter()}
        submissionError={null}
        onSubmit={async () => undefined}
      />,
    );

    expect(
      screen.getByRole('heading', { name: i18n.messages.signIn.title }),
    ).toBeTruthy();
    expect(screen.getByLabelText(i18n.messages.signIn.identifier)).toBeTruthy();
    expect(screen.getByLabelText(i18n.messages.signIn.secret)).toBeTruthy();
  });

  it('keeps the sign-in form when a secret is refused', () => {
    render(
      <SignInView
        errorPresenter={new ErrorPresenter()}
        submissionError={i18n.messages.errors.ACCESS_DENIED}
        onSubmit={async () => undefined}
      />,
    );

    expect(screen.getByText(i18n.messages.errors.ACCESS_DENIED)).toBeTruthy();
    expect(screen.getByLabelText(i18n.messages.signIn.identifier)).toBeTruthy();
  });
});
