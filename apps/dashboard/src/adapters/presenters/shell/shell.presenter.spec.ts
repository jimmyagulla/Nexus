import { ShellPresenter, type ShellViewModel } from './shell.presenter';

const shell: ShellViewModel = {
  role: 'employee',
  companyName: 'Atelier Moreau',
  user: { initials: 'CM', name: 'Camille Martin', lastLogin: '' },
  sections: [
    {
      title: 'Mes documents',
      items: [
        { label: 'Documents', to: '/documents', icon: 'ri-folder-line', badge: '3' },
        { label: 'Bulletins', to: '/bulletins', icon: 'ri-file-line', counter: 'unseenPayslips' },
      ],
    },
  ],
  mobileTabs: [],
  searchPlaceholder: '',
  hasUnreadNotifications: false,
  switchTo: { label: '', to: '/' },
};

const badges = (model: ShellViewModel) => model.sections[0].items.map((item) => item.badge);

describe('ShellPresenter', () => {
  it('shows a live count as the badge of its item, and leaves fixed badges alone', () => {
    expect(badges(new ShellPresenter().present(shell, { unseenPayslips: 2 }))).toEqual(['3', '2']);
  });

  it('hides the badge of a count at zero or not known yet', () => {
    expect(badges(new ShellPresenter().present(shell, { unseenPayslips: 0 }))).toEqual(['3', undefined]);
    expect(badges(new ShellPresenter().present(shell))).toEqual(['3', undefined]);
  });
});
