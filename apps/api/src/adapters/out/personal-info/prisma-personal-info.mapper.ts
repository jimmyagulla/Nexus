import {
  CalendarDate,
  PersonalContact,
  PersonalInfo,
} from '@hexagonal-monorepo-template/domain';
import type { PersonalInfo as PersonalInfoRecord } from '../../../infrastructure/prisma/prisma-client';

/** A `DATE` column comes back as midnight UTC of that day. */
function toCalendarDate(date: Date): CalendarDate {
  return CalendarDate.parse(date.toISOString().slice(0, 10));
}

export function toPersonalInfo(row: PersonalInfoRecord): PersonalInfo {
  return new PersonalInfo({
    companyId: row.companyId,
    employeeId: row.employeeId,
    contact: PersonalContact.parse({
      address: row.address,
      postalCodeAndCity: row.postalCodeAndCity,
      phone: row.phone,
      email: row.email,
    }),
    employment: {
      lastName: row.lastName,
      firstName: row.firstName,
      birthDate: toCalendarDate(row.birthDate),
      socialSecurityNumber: row.socialSecurityNumber,
      jobTitle: row.jobTitle,
      department: row.department,
      contractType: row.contractType,
      workingTime: row.workingTime,
      startDate: toCalendarDate(row.startDate),
      iban: row.iban,
    },
    updatedAt: row.updatedAt,
  });
}
