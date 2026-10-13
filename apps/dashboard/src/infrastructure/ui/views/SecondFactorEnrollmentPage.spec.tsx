import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { SecondFactorController } from '../../../adapters/controllers/second-factor.controller';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SecondFactorEnrollmentPresenter } from '../../../adapters/presenters/second-factor-enrollment.presenter';
import { SecondFactorComposition } from '../../composition/second-factor.composition';
import { i18n } from '../i18n/i18n';
import { SecondFactorEnrollmentPage } from './SecondFactorEnrollmentPage';

const labels = i18n.messages.secondFactor.enrollment;

function compositionOf(
  begin: () => Promise<{ secret: string; provisioningUri: string }>,
): SecondFactorComposition {
  return {
    controller: new SecondFactorController(
      { execute: begin },
      {
        execute: async (code) => {
          if (code !== '123456') {
            throw new Error(ErrorCode.SECOND_FACTOR_REQUIRED);
          }
          return { enrolled: true };
        },
      },
    ),
    enrollmentPresenter: new SecondFactorEnrollmentPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}

const started = async () => ({
  secret: 'ABCDEFGH',
  provisioningUri: 'otpauth://x',
});

function renderPage(deps: SecondFactorComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <SecondFactorEnrollmentPage deps={deps} />
    </QueryClientProvider>,
  );
}

async function submit(code: string) {
  fireEvent.change(await screen.findByLabelText(labels.code), {
    target: { value: code },
  });
  fireEvent.click(screen.getByRole('button', { name: labels.confirm }));
}

describe('SecondFactorEnrollmentPage', () => {
  it('waits while the enrollment starts', () => {
    renderPage(compositionOf(() => new Promise(() => undefined)));

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('shows the secret to set up', async () => {
    renderPage(compositionOf(started));

    expect(await screen.findByText('ABCD EFGH')).toBeTruthy();
  });

  it('explains why the enrollment could not start', async () => {
    renderPage(
      compositionOf(async () => {
        throw new Error(ErrorCode.ACCESS_DENIED);
      }),
    );

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it('announces the enrollment once a valid code is confirmed', async () => {
    renderPage(compositionOf(started));

    await submit('123456');

    expect(await screen.findByText(labels.done)).toBeTruthy();
  });

  it('keeps the enrollment open after an invalid code', async () => {
    renderPage(compositionOf(started));

    await submit('000000');

    expect(
      await screen.findByText(i18n.messages.errors.SECOND_FACTOR_REQUIRED),
    ).toBeTruthy();
    expect(screen.queryByText(labels.done)).toBeNull();
    expect(screen.getByLabelText(labels.code)).toBeTruthy();
  });
});
