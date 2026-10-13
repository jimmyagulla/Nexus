export const NotificationType = {
  CABINET_DOCUMENT_RECEIVED: 'cabinet.document.recu',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];
