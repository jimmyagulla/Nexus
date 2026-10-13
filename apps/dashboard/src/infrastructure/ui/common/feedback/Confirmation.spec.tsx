import { render, screen } from '@testing-library/react';
import { Confirmation } from './Confirmation';

describe('Confirmation', () => {
  it('announces the message politely', () => {
    render(<Confirmation message="Le document a été transmis." />);

    expect(screen.getByRole('status').textContent).toBe(
      'Le document a été transmis.',
    );
  });

  it('shows nothing when there is nothing to confirm', () => {
    render(<Confirmation message={null} />);

    expect(screen.queryByRole('status')).toBeNull();
  });
});
