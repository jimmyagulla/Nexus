import {
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';
import { PresenceListResponseDto } from './dto/presence-list-response.dto';
import { PresenceResponseDto } from './dto/presence-response.dto';

export function toPresenceResponse(
  snapshot: PresenceSnapshot,
): PresenceResponseDto {
  return {
    id: snapshot.id,
    employeeId: snapshot.employeeId,
    employeeName: snapshot.employeeName,
    month: snapshot.month,
    workedDays: snapshot.workedDays,
    leaves: snapshot.leaves.map((entry) => ({ ...entry })),
    absences: snapshot.absences.map((entry) => ({ ...entry })),
    sickLeaves: snapshot.sickLeaves.map((entry) => ({ ...entry })),
    overtime: snapshot.overtime.map((entry) => ({ ...entry })),
  };
}

export function toPresenceListResponse(
  list: PresenceListSnapshot,
): PresenceListResponseDto {
  return {
    presences: list.presences.map(toPresenceResponse),
    employees: list.employees.map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
    })),
    canManage: list.canManage,
  };
}
