export const ExchangeDirection = {
  COMPANY_TO_CABINET: 'COMPANY_TO_CABINET',
  CABINET_TO_COMPANY: 'CABINET_TO_COMPANY',
} as const;

export type ExchangeDirection =
  (typeof ExchangeDirection)[keyof typeof ExchangeDirection];
