import { render, screen } from '@testing-library/react';
import { Home } from './Home';
import { fr } from '../i18n/fr';

describe('Home', () => {
  it('shows the dashboard title', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: fr.home.title })).toBeTruthy();
  });
});
