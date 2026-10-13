import { render, screen } from '@testing-library/react';
import type { ExchangeHistoryEntryViewModel } from '../../../../../adapters/presenters/cabinet-exchange-history.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExchangeHistoryList } from './ExchangeHistoryList';

const entries: ExchangeHistoryEntryViewModel[] = [
  {
    key: 'a',
    who: 'Cabinet comptable',
    phrase: 'Le document a été consulté par le cabinet comptable.',
    when: '07/10/2026 08:00',
  },
  {
    key: 'b',
    who: 'Employeur',
    phrase: '5 documents ont été transmis au cabinet comptable.',
    when: '06/10/2026 10:05',
  },
];

describe('ExchangeHistoryList', () => {
  it('tells who did what and when, in the order given', () => {
    render(<ExchangeHistoryList entries={entries} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]?.textContent).toContain('Cabinet comptable');
    expect(items[0]?.textContent).toContain(
      'Le document a été consulté par le cabinet comptable.',
    );
    expect(items[0]?.textContent).toContain('07/10/2026 08:00');
    expect(items[1]?.textContent).toContain(
      '5 documents ont été transmis au cabinet comptable.',
    );
  });

  it('says that nothing was recorded yet', () => {
    render(<ExchangeHistoryList entries={[]} />);

    expect(screen.getByText(i18n.messages.cabinet.historyEmpty)).toBeTruthy();
    expect(screen.queryAllByRole('listitem')).toEqual([]);
  });
});
