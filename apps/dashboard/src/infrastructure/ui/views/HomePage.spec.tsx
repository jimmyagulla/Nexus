import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('shows the dashboard title', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeTruthy();
  });
});
