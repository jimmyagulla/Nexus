import { render, screen } from '@testing-library/react';
import { Home } from './Home';
import { i18n } from '../i18n/i18n';

describe('Home', () => {
  it('shows the dashboard title', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: i18n.messages.home.title })).toBeTruthy();
  });
});
