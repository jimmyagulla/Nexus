export const auth = {
  footerLinks: 'Mentions légales · Confidentialité · Aide',
  login: {
    title: 'Connexion à votre coffre',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    showPassword: 'Afficher le mot de passe',
    submit: 'Se connecter',
    securityNote:
      'Connexion chiffrée. Vos documents sont accessibles uniquement aux personnes autorisées.',
  },
  verification: {
    title: 'Vérification en deux étapes',
    codeSentPrefix: 'Un code à 6 chiffres a été envoyé à',
    codeSentSuffix: '. Il expire dans 10 minutes.',
    code: 'Code de vérification',
    trustDevice: 'Faire confiance à cet appareil pendant 30 jours',
    submit: 'Vérifier',
    codeNotReceived: 'Code non reçu ?',
    resend: 'Renvoyer le code',
  },
} as const;
