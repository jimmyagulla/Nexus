import { fireEvent, render, screen } from '@testing-library/react';
import { i18n } from '../i18n/i18n';
import { ReceivedDocumentsEmpty } from './ReceivedDocumentsEmpty';

describe('ReceivedDocumentsEmpty', () => {
  it('says that nothing was exchanged with the company yet', () => {
    render(<ReceivedDocumentsEmpty onDeposit={() => undefined} />);

    expect(
      screen.getByText("Aucun document n'a encore été échangé avec le cabinet."),
    ).toBeTruthy();
    expect(screen.getByText(i18n.messages.cabinet.emptyList)).toBeTruthy();
  });

  it('offers the cabinet to deposit a document, not to start a new one', () => {
    const deposits: number[] = [];
    render(<ReceivedDocumentsEmpty onDeposit={() => deposits.push(1)} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.depositAction,
      }),
    );

    expect(deposits).toEqual([1]);
    expect(
      screen.queryByRole('button', { name: i18n.messages.cabinet.newDocument }),
    ).toBeNull();
  });
});
