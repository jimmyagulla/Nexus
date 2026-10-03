import {
  AuditAction as DomainAuditAction,
  AuditSubject as DomainAuditSubject,
} from '@hexagonal-monorepo-template/domain';
import {
  AuditAction as PrismaAuditAction,
  AuditSubject as PrismaAuditSubject,
} from '../../../infrastructure/prisma/prisma-client';

const ACTION_TO_PRISMA: Record<DomainAuditAction, PrismaAuditAction> = {
  MODIFICATION: PrismaAuditAction.MODIFICATION,
  ADDITION: PrismaAuditAction.ADDITION,
  DELETION: PrismaAuditAction.DELETION,
};

const SUBJECT_TO_PRISMA: Record<DomainAuditSubject, PrismaAuditSubject> = {
  COMPANY_NAME: PrismaAuditSubject.COMPANY_NAME,
  COMPANY_CALENDAR_NON_WORKING_WEEKDAYS:
    PrismaAuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS,
  COMPANY_CALENDAR_HOLIDAY: PrismaAuditSubject.COMPANY_CALENDAR_HOLIDAY,
};

export function toPrismaAuditAction(
  action: DomainAuditAction,
): PrismaAuditAction {
  return ACTION_TO_PRISMA[action];
}

export function toPrismaAuditSubject(
  subject: DomainAuditSubject,
): PrismaAuditSubject {
  return SUBJECT_TO_PRISMA[subject];
}
