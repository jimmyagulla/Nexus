import {
  InMemoryPayslipGateway,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  DocumentFileFormat,
  ErrorCode,
  Payslip,
  PayslipEmployerName,
  PayslipFileName,
  PayslipPeriod,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { DownloadPayslipFromSessionUseCase } from './download-payslip-from-session.use-case';
import { ExportPayslipsFromSessionUseCase } from './export-payslips-from-session.use-case';
import { ListPayslipsFromSessionUseCase } from './list-payslips-from-session.use-case';
import { ViewPayslipFromSessionUseCase } from './view-payslip-from-session.use-case';

const actor: ActorContext = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };

function gateway(): InMemoryPayslipGateway {
  const payslip = new Payslip({
    id: 'jan', companyId: 'c1', employeeId: 'u1', uploadedById: 'hr1', employerName: PayslipEmployerName.parse('Atelier Moreau'),
    period: PayslipPeriod.of(2026, 1), fileName: PayslipFileName.parse('Bulletin_2026-01.pdf'),
    format: DocumentFileFormat.PDF, sizeBytes: 4, storageKey: 'k',
    availableAt: new Date('2026-01-31T00:00:00Z'), createdAt: new Date('2026-01-31T00:00:00Z'),
  });
  return new InMemoryPayslipGateway(new Map([['jan', { payslip, content: Uint8Array.from([0x25, 0x50, 0x44, 0x46]) }]]));
}

describe('payslips from the session', () => {
  it('lists the payslips of the employee carried by the session', async () => {
    const useCase = new ListPayslipsFromSessionUseCase(new InMemorySessionGateway('u1', actor), gateway());

    await expect(useCase.execute({ year: 2026 })).resolves.toMatchObject({ items: [{ id: 'jan' }], total: 1, years: [2026] });
  });

  it('opens, downloads and exports a payslip of the session', async () => {
    const sessions = new InMemorySessionGateway('u1', actor);
    const payslips = gateway();

    await expect(new ViewPayslipFromSessionUseCase(sessions, payslips).execute('jan')).resolves.toMatchObject({
      fileName: 'Bulletin_2026-01.pdf',
    });
    await expect(new DownloadPayslipFromSessionUseCase(sessions, payslips).execute('jan')).resolves.toMatchObject({
      fileName: 'Bulletin_2026-01.pdf',
    });
    await expect(new ExportPayslipsFromSessionUseCase(sessions, payslips).execute({ year: null })).resolves.toMatchObject([
      { payslipId: 'jan' },
    ]);
  });

  it('refuses when the session carries no company', async () => {
    const useCase = new ListPayslipsFromSessionUseCase(
      new InMemorySessionGateway('u1', { ...actor, companyId: null }),
      gateway(),
    );

    await expect(useCase.execute({ year: null })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
