import {
  PresenceListFilter,
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  buildUrl,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  companyPath,
  IHttpClient,
  IPresenceGateway,
} from '@hexagonal-monorepo-template/ports';

type AbsenceEntryPayload = {
  id: string;
  type: string;
  start: string;
  end: string;
  days: number;
};

type PresencePayload = {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  workedDays: number;
  proposedWorkedDays: number;
  adjustments: {
    actorId: string;
    occurredAt: string;
    before: number;
    after: number;
  }[];
  leaves: AbsenceEntryPayload[];
  absences: AbsenceEntryPayload[];
  sickLeaves: { id: string; date: string }[];
  overtime: { id: string; date: string; hours: number }[];
};

type PresenceListPayload = {
  presences: PresencePayload[];
  employees: { id: string; fullName: string }[];
  canManage: boolean;
};

export class ApiPresenceGateway implements IPresenceGateway {
  constructor(private readonly httpClient: IHttpClient) {}

  async list(
    companyId: string,
    filter: PresenceListFilter,
    token: string,
  ): Promise<PresenceListSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.get<ApiResponse<PresenceListPayload>>(
        buildUrl(companyPath(API_ROUTES.companies.presences, { companyId }), {
          employeeId: filter.employeeId,
          from: filter.from,
          to: filter.to,
        }),
        this.authorized(token),
      ),
    );
    return {
      presences: payload.presences.map((presence) => this.toSnapshot(presence)),
      employees: payload.employees.map((employee) => ({
        id: employee.id,
        companyId,
        fullName: employee.fullName,
      })),
      canManage: payload.canManage,
    };
  }

  async open(
    companyId: string,
    employeeId: string,
    month: string,
    token: string,
  ): Promise<PresenceSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.post<ApiResponse<PresencePayload>>(
        companyPath(API_ROUTES.companies.presences, { companyId }),
        { employeeId, month },
        this.authorized(token),
      ),
    );
    return this.toSnapshot(payload);
  }

  async adjustWorkedDays(
    companyId: string,
    presenceId: string,
    workedDays: number,
    token: string,
  ): Promise<PresenceSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.patch<ApiResponse<PresencePayload>>(
        companyPath(API_ROUTES.companies.presenceWorkedDays, {
          companyId,
          presenceId,
        }),
        { workedDays },
        this.authorized(token),
      ),
    );
    return this.toSnapshot(payload);
  }

  private authorized(token: string): { headers: { Authorization: string } } {
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  private toSnapshot(payload: PresencePayload): PresenceSnapshot {
    return {
      id: payload.id,
      employeeId: payload.employeeId,
      employeeName: payload.employeeName,
      month: payload.month,
      workedDays: payload.workedDays,
      proposedWorkedDays: payload.proposedWorkedDays,
      adjustments: payload.adjustments.map((entry) => ({ ...entry })),
      leaves: payload.leaves.map((entry) => ({ ...entry })),
      absences: payload.absences.map((entry) => ({ ...entry })),
      sickLeaves: payload.sickLeaves.map((entry) => ({ ...entry })),
      overtime: payload.overtime.map((entry) => ({ ...entry })),
    };
  }
}
