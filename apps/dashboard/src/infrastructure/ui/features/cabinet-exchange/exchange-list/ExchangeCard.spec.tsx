import { fireEvent, render, screen } from '@testing-library/react';
import type { CabinetExchangeViewModel } from '../../../../../adapters/presenters/cabinet-exchange.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExchangeCard } from './ExchangeCard';

const draft: CabinetExchangeViewModel = {
  id: 'ex-1',
  category: 'Facture',
  fileName: 'releve.pdf',
  direction: 'Entreprise vers cabinet',
  status: 'Brouillon',
  date: '06/10/2026',
  canMarkToTransmit: true,
  canTransmit: false,
};

function renderCard(exchange: CabinetExchangeViewModel) {
  const marked: string[] = [];
  const transmitted: string[] = [];
  render(
    <ul>
      <ExchangeCard
        exchange={exchange}
        onMarkToTransmit={(id) => marked.push(id)}
        onTransmit={(id) => transmitted.push(id)}
      />
    </ul>,
  );
  return { marked, transmitted };
}

describe('ExchangeCard', () => {
  it('describes the exchange', () => {
    renderCard(draft);

    const card = screen.getByRole('listitem');
    for (const text of [
      'Facture',
      'releve.pdf',
      'Entreprise vers cabinet',
      'Brouillon',
      '06/10/2026',
    ]) {
      expect(card.textContent).toContain(text);
    }
  });

  it('lets the employer mark a draft as ready to transmit', () => {
    const { marked } = renderCard(draft);

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.markToTransmit,
      }),
    );

    expect(marked).toEqual(['ex-1']);
  });

  it('offers no way to transmit a draft', () => {
    renderCard(draft);

    expect(
      screen.queryByRole('button', { name: i18n.messages.cabinet.transmit }),
    ).toBeNull();
  });

  it('lets the employer transmit an exchange that is ready', () => {
    const { transmitted } = renderCard({
      ...draft,
      status: 'À transmettre',
      canMarkToTransmit: false,
      canTransmit: true,
    });

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.cabinet.transmit }),
    );

    expect(transmitted).toEqual(['ex-1']);
  });

  it('offers no action on an exchange that left the company', () => {
    renderCard({
      ...draft,
      status: 'Reçu',
      canMarkToTransmit: false,
      canTransmit: false,
    });

    expect(screen.queryAllByRole('button')).toEqual([]);
  });
});
