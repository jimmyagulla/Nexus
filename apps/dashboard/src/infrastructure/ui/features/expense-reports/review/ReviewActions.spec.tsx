import { fireEvent, render, screen } from '@testing-library/react';
import { i18n } from '../../../i18n/i18n';
import { ReviewActions } from './ReviewActions';

type Availability = {
  requestable?: boolean;
  decidable?: boolean;
  reimbursable?: boolean;
};

function renderActions(options: Availability, calls: string[] = []) {
  render(
    <ReviewActions
      requestable={options.requestable ?? false}
      decidable={options.decidable ?? false}
      reimbursable={options.reimbursable ?? false}
      onRequestInformation={() => calls.push('information')}
      onValidate={() => calls.push('validate')}
      onRefuse={() => calls.push('refuse')}
      onReimburse={() => calls.push('reimburse')}
    />,
  );
}

const names = i18n.messages.expenseReports;

describe('ReviewActions', () => {
  it('offers every decision while the report is under review', () => {
    renderActions({ requestable: true, decidable: true });

    for (const name of [
      names.requestInformation,
      names.validate,
      names.refuse,
    ]) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
    expect(screen.queryByRole('button', { name: names.reimburse })).toBeNull();
  });

  it('only offers to ask for information while the report is merely submitted', () => {
    renderActions({ requestable: true });

    expect(
      screen.getByRole('button', { name: names.requestInformation }),
    ).toBeTruthy();
    expect(screen.queryByRole('button', { name: names.validate })).toBeNull();
    expect(screen.queryByRole('button', { name: names.refuse })).toBeNull();
    expect(screen.queryByRole('button', { name: names.reimburse })).toBeNull();
  });

  it('offers the reimbursement once the report is validated', () => {
    renderActions({ reimbursable: true });

    expect(screen.getByRole('button', { name: names.reimburse })).toBeTruthy();
    expect(screen.queryByRole('button', { name: names.validate })).toBeNull();
  });

  it('offers nothing once the report is processed', () => {
    renderActions({});

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('reports the action the employer chooses', () => {
    const calls: string[] = [];
    renderActions(
      { requestable: true, decidable: true, reimbursable: true },
      calls,
    );

    fireEvent.click(
      screen.getByRole('button', { name: names.requestInformation }),
    );
    fireEvent.click(screen.getByRole('button', { name: names.validate }));
    fireEvent.click(screen.getByRole('button', { name: names.refuse }));
    fireEvent.click(screen.getByRole('button', { name: names.reimburse }));

    expect(calls).toEqual(['information', 'validate', 'refuse', 'reimburse']);
  });
});
