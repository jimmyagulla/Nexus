import axios from 'axios';

export type CompanySettings = {
  id: string;
  name: string;
  nonWorkingWeekdays: number[];
  holidays: { id: string; date: string; label: string }[];
};

type SuccessEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

type ErrorEnvelope = {
  status: number;
  message: string;
};

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
});

function unwrap<T>(payload: SuccessEnvelope<T>): T {
  return payload.data;
}

function rethrow(error: unknown): never {
  if (axios.isAxiosError(error) && error.response?.data) {
    const body = error.response.data as ErrorEnvelope;
    throw new Error(body.message);
  }
  throw error;
}

export async function createCompany(name: string): Promise<CompanySettings> {
  try {
    const response = await client.post<SuccessEnvelope<CompanySettings>>(
      '/companies',
      { name },
    );
    return unwrap(response.data);
  } catch (error) {
    rethrow(error);
  }
}

export async function fetchCompanySettings(
  companyId: string,
): Promise<CompanySettings> {
  try {
    const response = await client.get<SuccessEnvelope<CompanySettings>>(
      `/companies/${companyId}/settings`,
      { headers: { 'x-company-id': companyId } },
    );
    return unwrap(response.data);
  } catch (error) {
    rethrow(error);
  }
}

export async function updateCompanyName(
  companyId: string,
  name: string,
): Promise<CompanySettings> {
  try {
    const response = await client.patch<SuccessEnvelope<CompanySettings>>(
      `/companies/${companyId}/name`,
      { name },
      { headers: { 'x-company-id': companyId } },
    );
    return unwrap(response.data);
  } catch (error) {
    rethrow(error);
  }
}

export async function updateNonWorkingWeekdays(
  companyId: string,
  weekdays: number[],
): Promise<CompanySettings> {
  try {
    const response = await client.put<SuccessEnvelope<CompanySettings>>(
      `/companies/${companyId}/calendar/non-working-weekdays`,
      { weekdays },
      { headers: { 'x-company-id': companyId } },
    );
    return unwrap(response.data);
  } catch (error) {
    rethrow(error);
  }
}

export async function addHoliday(
  companyId: string,
  date: string,
  label: string,
): Promise<CompanySettings> {
  try {
    const response = await client.post<SuccessEnvelope<CompanySettings>>(
      `/companies/${companyId}/calendar/holidays`,
      { date, label },
      { headers: { 'x-company-id': companyId } },
    );
    return unwrap(response.data);
  } catch (error) {
    rethrow(error);
  }
}

export async function removeHoliday(
  companyId: string,
  holidayId: string,
): Promise<CompanySettings> {
  try {
    const response = await client.delete<SuccessEnvelope<CompanySettings>>(
      `/companies/${companyId}/calendar/holidays/${holidayId}`,
      { headers: { 'x-company-id': companyId } },
    );
    return unwrap(response.data);
  } catch (error) {
    rethrow(error);
  }
}
