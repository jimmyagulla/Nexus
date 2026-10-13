import { render, screen } from '@testing-library/react';
import { i18n } from '../../../i18n/i18n';
import { ReceiptList } from './ReceiptList';

describe('ReceiptList', () => {
  it('lists every receipt by file name and size', () => {
    render(
      <ReceiptList
        receipts={[
          { id: 'f1', fileName: 'ticket.pdf', size: '2 Ko' },
          { id: 'f2', fileName: 'scan.png', size: '1,5 Mo' },
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('ticket.pdf')).toBeTruthy();
    expect(screen.getByText('1,5 Mo')).toBeTruthy();
  });

  it('announces a report without receipt', () => {
    render(<ReceiptList receipts={[]} />);

    expect(screen.getByText(i18n.messages.expenseReports.noReceipts)).toBeTruthy();
  });
});
