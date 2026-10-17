/**
 * What belongs to one person in one company: their documents today, their
 * leaves or expenses tomorrow.
 */
export type OwnerScope = {
  companyId: string;
  ownerId: string;
};
