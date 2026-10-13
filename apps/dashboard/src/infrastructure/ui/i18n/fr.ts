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
  enrollment: {
    title: 'Vérification complémentaire',
    instruction:
      "Ajoutez cette clé dans votre application d'authentification pour obtenir vos codes.",
    secret: 'Clé à saisir',
    uri: 'Lien de configuration',
    code: 'Code de vérification',
    submit: 'Confirmer',
  },
  workspace: {
    title: 'Mon espace',
    noDocuments: "Aucun document n'est disponible dans votre espace.",
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
    [ErrorCode.SECOND_FACTOR_REQUIRED]:
      'La vérification complémentaire est nécessaire pour accéder à votre espace.',
    [ErrorCode.EMPLOYEE_INACTIVE]:
      "Ce salarié est inactif. Cette action n'est plus possible.",
  },
} as const;
