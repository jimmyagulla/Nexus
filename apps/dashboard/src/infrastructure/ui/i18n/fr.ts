import { ErrorCode } from '@hexagonal-monorepo-template/domain';

export const fr = {
  navigation: {
    dashboard: 'Tableau de bord',
    accounts: 'Comptes',
    settings: 'Paramètres',
  },
  accounts: {
    title: 'Comptes',
    identifier: 'Identifiant',
    role: 'Rôle',
    status: 'Statut',
    invite: 'Inviter',
    disable: 'Désactiver',
    restore: 'Rétablir',
    activationLink: "Lien d'activation à remettre",
    roles: {
      EMPLOYER: 'Employeur',
      EMPLOYEE: 'Salarié',
      ACCOUNTANT: 'Cabinet comptable',
    },
    statuses: {
      INVITED: 'Invité',
      ACTIVE: 'Actif',
      DISABLED: 'Désactivé',
    },
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
  days: {
    SUNDAY: 'Dimanche',
    MONDAY: 'Lundi',
    TUESDAY: 'Mardi',
    WEDNESDAY: 'Mercredi',
    THURSDAY: 'Jeudi',
    FRIDAY: 'Vendredi',
    SATURDAY: 'Samedi',
  },
  signIn: {
    title: 'Connexion',
    identifier: 'Identifiant',
    secret: 'Secret',
    submit: 'Se connecter',
  },
  activation: {
    title: 'Activer votre accès',
    secret: 'Secret',
    submit: 'Activer',
    opened: 'Votre espace est ouvert.',
  },
  errors: {
    [ErrorCode.ACCESS_DENIED]: "Vous n'avez pas accès à cet élément.",
    [ErrorCode.REQUIRED_INFORMATION]:
      'Renseignez les informations obligatoires.',
    [ErrorCode.POTENTIAL_DUPLICATE]: 'Un élément semblable existe déjà.',
    [ErrorCode.INVITATION_INVALID]:
      "Ce lien d'activation n'est plus utilisable.",
    [ErrorCode.ACCOUNT_LOCKED]:
      "La connexion est bloquée. Un employeur doit rétablir l'accès.",
  },
} as const;
