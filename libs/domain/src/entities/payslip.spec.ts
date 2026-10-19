import { ErrorCode } from '../errors/error-code';
import { requireOwnedPayslip } from '../services/require-owned-payslip';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import { PayslipEmployerName } from '../value-objects/payslip-employer-name';
import { PayslipFileName } from '../value-objects/payslip-file-name';
import { PayslipPeriod } from '../value-objects/payslip-period';
import { Payslip } from './payslip';

function payslipNamed(fileName: string, format: DocumentFileFormat = DocumentFileFormat.PDF): Payslip {
  return new Payslip({
    id: 'p1',
    companyId: 'c1',
    employeeId: 'u1',
    uploadedById: 'hr1',
    employerName: PayslipEmployerName.parse('Atelier Moreau'),
    period: PayslipPeriod.of(2026, 9),
    netPayCents: 218437,
    fileName: PayslipFileName.parse(fileName),
    format,
    sizeBytes: 217_088,
    storageKey: 'c1/u1/k',
    availableAt: new Date('2026-09-30T08:00:00Z'),
    createdAt: new Date('2026-09-30T08:00:00Z'),
  });
}

describe('Payslip', () => {
  it('saves its file under its name when the name carries the extension', () => {
    expect(payslipNamed('Bulletin_2026-09.PDF').downloadName).toBe('Bulletin_2026-09.PDF');
  });

  it('adds the extension of its format to a name without one', () => {
    expect(payslipNamed('Bulletin septembre', DocumentFileFormat.PNG).downloadName).toBe('Bulletin septembre.png');
  });

  it('belongs to its employee, in their company only', () => {
    const payslip = payslipNamed('Bulletin');

    expect([
      payslip.isOwnedBy('c1', 'u1'),
      payslip.isOwnedBy('c1', 'u2'),
      payslip.isOwnedBy('c2', 'u1'),
      payslip.isOwnedBy(null, 'u1'),
    ]).toEqual([true, false, false, false]);
  });
});

describe('requireOwnedPayslip', () => {
  const employee = { userId: 'u1', companyId: 'c1', role: null };

  it('hands back the payslip of the employee', () => {
    const payslip = payslipNamed('Bulletin');

    expect(requireOwnedPayslip(payslip, employee)).toBe(payslip);
  });

  it.each([
    ['a colleague', { ...employee, userId: 'u2' }],
    ['someone from another company', { ...employee, companyId: 'c2' }],
  ])('refuses %s exactly like a missing payslip', (_who, actor) => {
    expect(() => requireOwnedPayslip(payslipNamed('Bulletin'), actor)).toThrow(ErrorCode.ACCESS_DENIED);
    expect(() => requireOwnedPayslip(null, employee)).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
