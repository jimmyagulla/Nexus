import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const fr = {
  navigation: {
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
  },
  loading: 'Chargement…',
  settings: {
    title: 'Paramètres',
    name: 'Nom',
    saveName: 'Enregistrer le nom',
    nonWorkingWeekdays: 'Jours habituels non travaillés',
    saveWeekdays: 'Enregistrer les jours',
    publicHolidays: 'Jours fériés',
    addHoliday: 'Ajouter',
    removeHoliday: 'Retirer',
    date: 'Date',
    label: 'Libellé',
  },
  days: {
    SUNDAY: 'Dimanche',
    MONDAY: 'Lundi',
    TUESDAY: 'Mardi',
    WEDNESDAY: 'Mercredi',
    THURSDAY: 'Jeudi',
    FRIDAY: 'Vendredi',
    SATURDAY: 'Samedi',
  },
  errors: {
    [ErrorCode.ACCESS_DENIED]: "Vous n'avez pas accès à cet élément.",
    [ErrorCode.REQUIRED_INFORMATION]:
      'Renseignez les informations obligatoires.',
    [ErrorCode.POTENTIAL_DUPLICATE]: 'Un élément semblable existe déjà.',
  },
} as const;
