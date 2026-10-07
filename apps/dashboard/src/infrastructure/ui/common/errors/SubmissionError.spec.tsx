import { render, screen } from '@testing-library/react';
import { SubmissionError } from './SubmissionError';

describe('SubmissionError', () => {
  it('announces the message it is given', () => {
    render(<SubmissionError message="Un élément semblable existe déjà." />);

    expect(screen.getByRole('alert').textContent).toBe(
      'Un élément semblable existe déjà.',
    );
  });

  it('stays silent when there is nothing to report', () => {
    render(<SubmissionError message={null} />);

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
