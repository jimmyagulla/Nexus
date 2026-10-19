export const personalInfo = {
  fields: {
    address: 'Adresse',
    postalCodeAndCity: 'Code postal et ville',
    phone: 'Téléphone',
    email: 'Adresse e-mail personnelle',
  },
  employment: {
    lastName: 'Nom',
    firstName: 'Prénom',
    birthDate: 'Date de naissance',
    socialSecurityNumber: 'N° de sécurité sociale',
    jobTitle: 'Poste',
    department: 'Service',
    contract: 'Type de contrat',
    startDate: "Date d'entrée",
    iban: 'Coordonnées bancaires',
    contractValue: '{contract} — {workingTime}',
    contractTypes: {
      PERMANENT: 'CDI',
      FIXED_TERM: 'CDD',
      APPRENTICESHIP: "Contrat d'apprentissage",
      PROFESSIONALISATION: 'Contrat de professionnalisation',
      INTERNSHIP: 'Stage',
    },
    workingTimes: {
      FULL_TIME: 'temps plein',
      PART_TIME: 'temps partiel',
    },
  },
  view: {
    title: 'Mes informations',
    editableTitle: 'Informations modifiables par vous',
    editableDescription: 'Coordonnées personnelles',
    edit: 'Modifier',
    employerTitle: "Informations gérées par l'employeur",
    employerDescription: 'Pour toute correction, contactez le service RH.',
    reportError: 'Signaler une erreur au service RH',
    lastUpdate: 'Dernière mise à jour le {date}',
  },
  edit: {
    title: 'Modifier mes coordonnées',
    description:
      'Les champs modifiés sont signalés en bleu. Le service RH est informé de chaque changement.',
    bankNote:
      "Vos coordonnées bancaires sont gérées par l'employeur. Pour les modifier, adressez un RIB au service RH.",
    save: 'Enregistrer',
  },
  confirm: {
    title: 'Confirmer la modification',
    description: 'Vérifiez les informations avant de les enregistrer.',
    back: 'Revenir',
    confirm: 'Confirmer',
    emailNotice:
      'Un e-mail de confirmation sera envoyé à {email} et le service RH sera informé.',
  },
  updated: {
    title: 'Vos coordonnées ont été mises à jour.',
  },
} as const;
