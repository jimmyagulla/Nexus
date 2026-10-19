import {
  Payslip,
  PayslipEmployerName,
  PayslipFileName,
  PayslipPeriod,
} from '@hexagonal-monorepo-template/domain';
import type { Payslip as PayslipRecord } from '../../../infrastructure/prisma/prisma-client';

export function toPayslip(row: PayslipRecord): Payslip {
  return new Payslip({
    id: row.id,
    companyId: row.companyId,
    employeeId: row.employeeId,
    uploadedById: row.uploadedById,
    employerName: PayslipEmployerName.parse(row.employerName),
    period: PayslipPeriod.of(row.year, row.month),
    fileName: PayslipFileName.parse(row.fileName),
    format: row.format,
    sizeBytes: row.sizeBytes,
    storageKey: row.storageKey,
    availableAt: row.availableAt,
    createdAt: row.createdAt,
  });
}
