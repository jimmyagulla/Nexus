import {
  AuditAction as DomainAuditAction,
  AuditSubject as DomainAuditSubject,
} from '@hexagonal-monorepo-template/domain';
import {
  AuditAction as PrismaAuditAction,
  AuditSubject as PrismaAuditSubject,
} from '../../../infrastructure/prisma/generated';

const ACTION_TO_PRISMA: Record<DomainAuditAction, PrismaAuditAction> = {
  modification: PrismaAuditAction.modification,
  ajout: PrismaAuditAction.ajout,
  suppression: PrismaAuditAction.suppression,
};

const SUBJECT_TO_PRISMA: Record<DomainAuditSubject, PrismaAuditSubject> = {
  company_name: PrismaAuditSubject.company_name,
  company_calendar_non_working_weekdays:
    PrismaAuditSubject.company_calendar_non_working_weekdays,
  company_calendar_holiday: PrismaAuditSubject.company_calendar_holiday,
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
