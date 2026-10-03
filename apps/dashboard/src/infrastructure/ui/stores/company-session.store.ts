const STORAGE_KEY = 'nexus.companyId';

export function getCompanyId(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setCompanyId(companyId: string): void {
  localStorage.setItem(STORAGE_KEY, companyId);
}
