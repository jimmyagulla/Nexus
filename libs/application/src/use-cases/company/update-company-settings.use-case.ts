import {
  AuditAction,
  AuditEvent,
  AuditSubject,
  Company,
  CompanyCalendar,
  companyNameValue,
  holidayValue,
  nonWorkingWeekdaysValue,
} from '@hexagonal-monorepo-template/domain';
import {
  HolidayMutationCommand,
  IAuditLogRepository,
  ICompanyRepository,
  IUpdateCompanySettingsInboundPort,
  RemoveHolidayCommand,
  UpdateCompanyNameCommand,
  UpdateNonWorkingWeekdaysCommand,
} from '@hexagonal-monorepo-template/ports';
import { requireAccessibleCompany } from './company-access';

export class UpdateCompanySettingsUseCase
  implements IUpdateCompanySettingsInboundPort
{
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly auditLog: IAuditLogRepository,
  ) {}

  async updateName(command: UpdateCompanyNameCommand): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const updated = current.rename(command.name);
    await this.companies.save(updated);
    await this.auditLog.append(
      new AuditEvent(
        updated.id,
        AuditAction.MODIFICATION,
        AuditSubject.COMPANY_NAME,
        companyNameValue(current.name),
        companyNameValue(updated.name),
        new Date(),
      ),
    );
    return updated;
  }

  async updateNonWorkingWeekdays(
    command: UpdateNonWorkingWeekdaysCommand,
  ): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const updated = CompanyCalendar.setNonWorkingWeekdays(
      current,
      command.weekdays,
    );
    await this.companies.save(updated);
    await this.auditLog.append(
      new AuditEvent(
        updated.id,
        AuditAction.MODIFICATION,
        AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS,
        nonWorkingWeekdaysValue([...current.nonWorkingWeekdays]),
        nonWorkingWeekdaysValue([...updated.nonWorkingWeekdays]),
        new Date(),
      ),
    );
    return updated;
  }

  async addHoliday(command: HolidayMutationCommand): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const updated = CompanyCalendar.addHoliday(
      current,
      command.date,
      command.label,
    );
    const holiday = updated.holidays.at(-1);
    await this.companies.save(updated);
    if (holiday !== undefined) {
      await this.auditLog.append(
        new AuditEvent(
          updated.id,
          AuditAction.AJOUT,
          AuditSubject.COMPANY_CALENDAR_HOLIDAY,
          null,
          holidayValue({
            id: holiday.id,
            date: holiday.date,
            label: holiday.label,
          }),
          new Date(),
        ),
      );
    }
    return updated;
  }

  async updateHoliday(command: HolidayMutationCommand): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const existing = current.holidays.find(
      (holiday) => holiday.id === command.holidayId,
    );
    if (existing === undefined) {
      return current;
    }
    const updated = CompanyCalendar.updateHoliday(
      current,
      command.holidayId ?? '',
      command.date,
      command.label,
    );
    await this.companies.save(updated);
    await this.auditLog.append(
      new AuditEvent(
        updated.id,
        AuditAction.MODIFICATION,
        AuditSubject.COMPANY_CALENDAR_HOLIDAY,
        holidayValue({
          id: existing.id,
          date: existing.date,
          label: existing.label,
        }),
        holidayValue({
          id: existing.id,
          date: command.date,
          label: command.label,
        }),
        new Date(),
      ),
    );
    return updated;
  }

  async removeHoliday(command: RemoveHolidayCommand): Promise<Company> {
    const current = await requireAccessibleCompany(
      command.companyId,
      command.actorCompanyId,
      this.companies,
    );
    const existing = current.holidays.find(
      (holiday) => holiday.id === command.holidayId,
    );
    const updated = CompanyCalendar.removeHoliday(current, command.holidayId);
    await this.companies.save(updated);
    if (existing !== undefined) {
      await this.auditLog.append(
        new AuditEvent(
          updated.id,
          AuditAction.SUPPRESSION,
          AuditSubject.COMPANY_CALENDAR_HOLIDAY,
          holidayValue({
            id: existing.id,
            date: existing.date,
            label: existing.label,
          }),
          null,
          new Date(),
        ),
      );
    }
    return updated;
  }
}
