import { render, screen } from '@testing-library/react';
import { i18n } from '../../i18n/i18n';
import { EmployeeWorkspaceView } from './EmployeeWorkspaceView';

describe('EmployeeWorkspaceView', () => {
  it('lands on the workspace of the employee', () => {
    render(<EmployeeWorkspaceView model={{ fullName: 'Alice Martin' }} />);

    expect(
      screen.getByRole('heading', { name: i18n.messages.workspace.title }),
    ).toBeTruthy();
    expect(screen.getByText('Alice Martin')).toBeTruthy();
  });

  it('confirms that the workspace is open', () => {
    render(<EmployeeWorkspaceView model={{ fullName: 'Alice Martin' }} />);

    expect(screen.getByText(i18n.messages.activation.opened)).toBeTruthy();
    expect(i18n.messages.activation.opened).toBe('Votre espace est ouvert.');
  });

  it('shows an empty document list when nothing was handed over yet', () => {
    render(<EmployeeWorkspaceView model={{ fullName: 'Alice Martin' }} />);

    expect(screen.getByText(i18n.messages.workspace.noDocuments)).toBeTruthy();
    expect(i18n.messages.workspace.noDocuments).toBe(
      "Aucun document n'est disponible dans votre espace.",
    );
  });
});
