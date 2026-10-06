import {
  AuditEvent,
  CalendarDate,
  Company,
  PublicHoliday,
} from '@hexagonal-monorepo-template/domain';
import {
  IAuditLogRepository,
  IClock,
  ICompanyIdentityBinder,
  ICompanyRepository,
  IIdGenerator,
  IPublicHolidayRepository,
} from '@hexagonal-monorepo-template/ports';

export class MemoryCompanyRepository implements ICompanyRepository {
  constructor(private readonly companies = new Map<string, Company>()) {}

  async save(company: Company): Promise<void> {
    this.companies.set(company.id, company);
  }

  async findById(companyId: string): Promise<Company | null> {
    return this.companies.get(companyId) ?? null;
  }
}

export class MemoryPublicHolidayRepository implements IPublicHolidayRepository {
  constructor(private readonly holidays = new Map<string, PublicHoliday>()) {}

  async save(holiday: PublicHoliday): Promise<void> {
    this.holidays.set(holiday.id, holiday);
  }

  async findById(id: string): Promise<PublicHoliday | null> {
    return this.holidays.get(id) ?? null;
  }

  async findByDateAndLabel(
    date: CalendarDate,
    label: string,
  ): Promise<PublicHoliday | null> {
    return (
      [...this.holidays.values()].find(
        (holiday) => holiday.date.equals(date) && holiday.label === label,
      ) ?? null
    );
  }
}

export class MemoryAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly events = new Map<string, AuditEvent>()) {}

  async append(event: AuditEvent): Promise<void> {
    this.events.set(event.id, event);
  }

  async listByCompany(companyId: string): Promise<readonly AuditEvent[]> {
    return [...this.events.values()].filter(
      (event) => event.companyId === companyId,
    );
  }
}

export class MemoryClock implements IClock {
  constructor(private readonly instant: Date) {}

  now(): Date {
    return this.instant;
  }
}

export class MemoryIds implements IIdGenerator {
  private count = 0;

  next(): string {
    this.count += 1;
    return `id-${this.count}`;
  }
}

export class MemoryIdentityBinder implements ICompanyIdentityBinder {
  readonly bindings = new Map<string, string>();

  async bindEmployer(userId: string, companyId: string): Promise<void> {
    this.bindings.set(userId, companyId);
  }
}
