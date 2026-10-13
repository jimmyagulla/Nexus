import { fireEvent, render, screen } from '@testing-library/react';
import { i18n } from '../../../i18n/i18n';
import { ReviewActions } from './ReviewActions';

function renderActions(
  options: { requestable: boolean; decidable: boolean },
  calls: string[] = [],
) {
  render(
    <ReviewActions
      {...options}
      onRequestInformation={() => calls.push('information')}
      onValidate={() => calls.push('validate')}
      onRefuse={() => calls.push('refuse')}
    />,
  );
}

const names = i18n.messages.expenseReports;

describe('ReviewActions', () => {
  it('offers every action while the report is under review', () => {
    renderActions({ requestable: true, decidable: true });

    for (const name of [
      names.requestInformation,
      names.validate,
      names.refuse,
    ]) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
  });

  it('only offers to ask for information while the report is merely submitted', () => {
    renderActions({ requestable: true, decidable: false });

    expect(
      screen.getByRole('button', { name: names.requestInformation }),
    ).toBeTruthy();
    expect(screen.queryByRole('button', { name: names.validate })).toBeNull();
    expect(screen.queryByRole('button', { name: names.refuse })).toBeNull();
  });

  it('offers nothing once the report is processed', () => {
    renderActions({ requestable: false, decidable: false });

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('reports the action the employer chooses', () => {
    const calls: string[] = [];
    renderActions({ requestable: true, decidable: true }, calls);

    fireEvent.click(
      screen.getByRole('button', { name: names.requestInformation }),
    );
    fireEvent.click(screen.getByRole('button', { name: names.validate }));
    fireEvent.click(screen.getByRole('button', { name: names.refuse }));

    expect(calls).toEqual(['information', 'validate', 'refuse']);
  });
});
