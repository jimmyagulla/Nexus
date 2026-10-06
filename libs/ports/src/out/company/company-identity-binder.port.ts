export interface ICompanyIdentityBinder {
  bindEmployer(userId: string, companyId: string): Promise<void>;
}

export const ICompanyIdentityBinder = Symbol('ICompanyIdentityBinder');
