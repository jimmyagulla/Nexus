export const BusinessErrorCode = {
  INFORMATION_OBLIGATOIRE: 'INFORMATION_OBLIGATOIRE',
  NON_AUTORISE: 'NON_AUTORISE',
} as const;

export type BusinessErrorCode =
  (typeof BusinessErrorCode)[keyof typeof BusinessErrorCode];

export const BUSINESS_ERROR_MESSAGES: Record<BusinessErrorCode, string> = {
  INFORMATION_OBLIGATOIRE: 'Renseignez les informations obligatoires.',
  NON_AUTORISE: "Vous n'avez pas accès à cet élément.",
};
