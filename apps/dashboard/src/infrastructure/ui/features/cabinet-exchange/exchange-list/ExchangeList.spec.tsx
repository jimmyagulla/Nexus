import { fireEvent, render, screen } from '@testing-library/react';
import type { CabinetExchangeViewModel } from '../../../../../adapters/presenters/cabinet-exchange.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExchangeList } from './ExchangeList';

function exchange(id: string): CabinetExchangeViewModel {
  return {
    id,
    category: `Catégorie ${id}`,
    fileName: `${id}.pdf`,
    direction: 'Entreprise vers cabinet',
    status: 'Brouillon',
    date: '06/10/2026',
    canMarkToTransmit: true,
    canTransmit: false,
  };
}

describe('ExchangeList', () => {
  it('shows one card per exchange, in the order given', () => {
    render(
      <ExchangeList
        exchanges={[exchange('b'), exchange('a')]}
        onMarkToTransmit={() => undefined}
        onTransmit={() => undefined}
      />,
    );

    expect(
      screen.getAllByRole('listitem').map((item) => item.textContent),
    ).toEqual([
      expect.stringContaining('Catégorie b'),
      expect.stringContaining('Catégorie a'),
    ]);
  });

  it('relays the action chosen on a card with the exchange it concerns', () => {
    const marked: string[] = [];
    render(
      <ExchangeList
        exchanges={[exchange('a'), exchange('b')]}
        onMarkToTransmit={(id) => marked.push(id)}
        onTransmit={() => undefined}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: i18n.messages.cabinet.markToTransmit,
      })[1]!,
    );

    expect(marked).toEqual(['b']);
  });
});
