import { render, screen } from '@testing-library/react';
import { ExchangeHistoryItem } from './ExchangeHistoryItem';

describe('ExchangeHistoryItem', () => {
  it('reads as one line of the history', () => {
    render(
      <ul>
        <ExchangeHistoryItem
          entry={{
            key: 'a',
            who: 'Employeur',
            phrase: 'Le document a été transmis au cabinet comptable.',
            when: '06/10/2026 10:05',
          }}
        />
      </ul>,
    );

    const item = screen.getByRole('listitem');
    for (const text of [
      'Employeur',
      'Le document a été transmis au cabinet comptable.',
      '06/10/2026 10:05',
    ]) {
      expect(item.textContent).toContain(text);
    }
  });
});
