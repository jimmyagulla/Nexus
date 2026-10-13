import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const fr = {
  navigation: {
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
  },
  loading: 'Chargement…',
  home: {
    title: 'Dashboard',
  },
  settings: {
    title: 'Paramètres',
    name: 'Nom',
    saveName: 'Enregistrer le nom',
    nonWorkingWeekdays: 'Jours habituels non travaillés',
    saveWeekdays: 'Enregistrer les jours',
    publicHolidays: 'Jours fériés',
    addHoliday: 'Ajouter',
    addHolidayTitle: 'Ajouter un jour férié',
    noPublicHolidays: 'Aucun jour férié retenu.',
    removeHoliday: 'Retirer',
    date: 'Date',
    label: 'Libellé',
  },
  secondFactor: {
    enrollment: {
      title: 'Vérification complémentaire',
      instructions:
        "Ajoutez cette clé dans votre application d'authentification, puis saisissez le code qu'elle affiche.",
      secret: 'Clé de configuration',
      code: 'Code de vérification',
      confirm: 'Confirmer',
      done: 'La vérification complémentaire est en place.',
      recoveryTitle: 'Codes de récupération',
      recoveryNotice:
        "Conservez ces codes en lieu sûr. Chacun ne sert qu'une fois, à la place du code habituel, et ils ne seront plus affichés.",
    },
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
    [ErrorCode.SECOND_FACTOR_REQUIRED]:
      'La vérification complémentaire est nécessaire pour accéder à votre espace.',
  },
} as const;
