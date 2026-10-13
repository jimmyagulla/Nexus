import { render, screen } from '@testing-library/react';
import { RecoveryCodeList } from './RecoveryCodeList';

describe('RecoveryCodeList', () => {
  it('shows every recovery code', () => {
    render(<RecoveryCodeList codes={['ABCDE-23456', 'FGHIJ-23457']} />);

    expect(
      screen.getAllByRole('listitem').map((item) => item.textContent),
    ).toEqual(['ABCDE-23456', 'FGHIJ-23457']);
  });

  it('shows nothing when there is no code', () => {
    render(<RecoveryCodeList codes={[]} />);

    expect(screen.queryAllByRole('listitem')).toEqual([]);
  });
});
