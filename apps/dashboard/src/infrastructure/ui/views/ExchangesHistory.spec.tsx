import { render, screen } from '@testing-library/react';
import { i18n } from '../i18n/i18n';
import { ExchangesHistory } from './ExchangesHistory';

describe('ExchangesHistory', () => {
  it('is titled after the history of the exchanges', () => {
    render(<ExchangesHistory entries={[]} />);

    expect(
      screen.getByRole('heading', { name: i18n.messages.cabinet.historyTitle }),
    ).toBeTruthy();
  });

  it('tells the steps of the exchanges', () => {
    render(
      <ExchangesHistory
        entries={[
          {
            key: 'a',
            who: 'Cabinet comptable',
            phrase: 'Le document a été transmis à l’entreprise.',
            when: '08/10/2026 10:00',
          },
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('says that nothing was recorded yet', () => {
    render(<ExchangesHistory entries={[]} />);

    expect(screen.getByText(i18n.messages.cabinet.historyEmpty)).toBeTruthy();
  });
});
