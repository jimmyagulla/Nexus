import { Weekday as DomainWeekday } from '@hexagonal-monorepo-template/domain';
import { Weekday as PrismaWeekday } from '../../infrastructure/prisma/generated';

const TO_PRISMA: Record<DomainWeekday, PrismaWeekday> = {
  0: PrismaWeekday.SUNDAY,
  1: PrismaWeekday.MONDAY,
  2: PrismaWeekday.TUESDAY,
  3: PrismaWeekday.WEDNESDAY,
  4: PrismaWeekday.THURSDAY,
  5: PrismaWeekday.FRIDAY,
  6: PrismaWeekday.SATURDAY,
};

const FROM_PRISMA: Record<PrismaWeekday, DomainWeekday> = {
  SUNDAY: DomainWeekday.SUNDAY,
  MONDAY: DomainWeekday.MONDAY,
  TUESDAY: DomainWeekday.TUESDAY,
  WEDNESDAY: DomainWeekday.WEDNESDAY,
  THURSDAY: DomainWeekday.THURSDAY,
  FRIDAY: DomainWeekday.FRIDAY,
  SATURDAY: DomainWeekday.SATURDAY,
};

export function toPrismaWeekday(weekday: DomainWeekday): PrismaWeekday {
  return TO_PRISMA[weekday];
}

export function fromPrismaWeekday(weekday: PrismaWeekday): DomainWeekday {
  return FROM_PRISMA[weekday];
}
