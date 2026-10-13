import { fireEvent, render, screen } from '@testing-library/react';
import type { CabinetExchangeViewModel } from '../../../adapters/presenters/cabinet-exchange.presenter';
import { i18n } from '../i18n/i18n';
import { ReceivedDocuments } from './ReceivedDocuments';

const received: CabinetExchangeViewModel = {
  id: 'ex-1',
  category: 'Facture',
  fileName: 'releve.pdf',
  direction: 'Entreprise vers cabinet',
  status: 'Reçu',
  date: '06/10/2026',
  consultedOn: null,
  canMarkToTransmit: false,
  canTransmit: false,
  canOpen: true,
};

describe('ReceivedDocuments', () => {
  it('is titled after the received documents', () => {
    render(
      <ReceivedDocuments exchanges={[received]} onOpen={() => undefined} />,
    );

    expect(
      screen.getByRole('heading', {
        name: i18n.messages.cabinet.receivedTitle,
      }),
    ).toBeTruthy();
  });

  it('lists what the cabinet received', () => {
    render(
      <ReceivedDocuments exchanges={[received]} onOpen={() => undefined} />,
    );

    expect(screen.getByText('releve.pdf')).toBeTruthy();
  });

  it('relays the request to open a document', () => {
    const opened: string[] = [];
    render(
      <ReceivedDocuments
        exchanges={[received]}
        onOpen={(id) => opened.push(id)}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.cabinet.open }),
    );

    expect(opened).toEqual(['ex-1']);
  });

  it('offers no way to prepare or transmit a document', () => {
    render(
      <ReceivedDocuments exchanges={[received]} onOpen={() => undefined} />,
    );

    expect(
      screen.queryByRole('button', { name: i18n.messages.cabinet.newDocument }),
    ).toBeNull();
  });

  it('never links a file named after an employee to that employee record', () => {
    render(
      <ReceivedDocuments
        exchanges={[{ ...received, fileName: 'bulletin-marie-martin.pdf' }]}
        onOpen={() => undefined}
      />,
    );

    expect(screen.getByText('bulletin-marie-martin.pdf')).toBeTruthy();
    expect(screen.queryAllByRole('link')).toEqual([]);
  });
});
