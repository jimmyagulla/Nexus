export const personalInfo = {
  view: {
    title: 'Mes informations',
    editableTitle: 'Informations modifiables par vous',
    editableDescription: 'Coordonnées personnelles',
    edit: 'Modifier',
    employerTitle: "Informations gérées par l'employeur",
    employerDescription: 'Pour toute correction, contactez le service RH.',
    reportError: 'Signaler une erreur au service RH',
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
  },
  updated: {
    title: 'Vos coordonnées ont été mises à jour.',
    modified: 'Modifié',
    dismiss: 'Fermer le message',
  },
} as const;
