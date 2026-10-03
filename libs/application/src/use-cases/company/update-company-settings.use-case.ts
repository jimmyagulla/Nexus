import {
  AuditEntry,
  Company,
  CompanyCalendar,
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
      new AuditEntry(
        updated.id,
        'modification',
        'Nom de l’entreprise',
        `Le nom de l’entreprise est passé de « ${current.name} » à « ${updated.name} ».`,
        current.name,
        updated.name,
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
    const before = JSON.stringify(current.nonWorkingWeekdays);
    const updated = CompanyCalendar.setNonWorkingWeekdays(
      current,
      command.weekdays,
    );
    await this.companies.save(updated);
    await this.auditLog.append(
      new AuditEntry(
        updated.id,
        'modification',
        'Calendrier',
        'Les jours habituels non travaillés ont été modifiés.',
        before,
        JSON.stringify(updated.nonWorkingWeekdays),
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
    await this.auditLog.append(
      new AuditEntry(
        updated.id,
        'ajout',
        'Jour férié',
        `Le jour férié « ${holiday?.label ?? command.label} » a été ajouté.`,
        null,
        `${command.date} — ${command.label}`,
        new Date(),
      ),
    );
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
      const unchanged = current;
      return unchanged;
    }
    const updated = CompanyCalendar.updateHoliday(
      current,
      command.holidayId ?? '',
      command.date,
      command.label,
    );
    await this.companies.save(updated);
    await this.auditLog.append(
      new AuditEntry(
        updated.id,
        'modification',
        'Jour férié',
        `Le jour férié « ${existing.label} » a été modifié.`,
        `${existing.date} — ${existing.label}`,
        `${command.date} — ${command.label}`,
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
        new AuditEntry(
          updated.id,
          'suppression',
          'Jour férié',
          `Le jour férié « ${existing.label} » a été retiré du calendrier.`,
          `${existing.date} — ${existing.label}`,
          null,
          new Date(),
        ),
      );
    }
    return updated;
  }
}
