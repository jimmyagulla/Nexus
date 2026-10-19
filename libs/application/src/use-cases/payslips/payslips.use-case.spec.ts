import {
  InMemoryPayslipFileStorage,
  InMemoryPayslipRepository,
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
import { DownloadPayslipUseCase } from './download-payslip.use-case';
import { ExportPayslipsUseCase } from './export-payslips.use-case';
import { ListPayslipsUseCase } from './list-payslips.use-case';
import { ViewPayslipUseCase } from './view-payslip.use-case';

const employee: ActorContext = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE };
const pdf = { contentType: 'application/pdf', content: Uint8Array.from([0x25, 0x50, 0x44, 0x46]) };
const pdfUrl = 'data:application/pdf;base64,JVBERg==';

function payslipOf(id: string, year: number, month: number, employeeId = 'u1'): Payslip {
  return new Payslip({
    id, companyId: 'c1', employeeId, uploadedById: 'hr1', employerName: PayslipEmployerName.parse('Atelier Moreau'),
    period: PayslipPeriod.of(year, month), netPayCents: 218437, fileName: PayslipFileName.parse(`Bulletin_${year}-${month}`),
    format: DocumentFileFormat.PDF, sizeBytes: 4, storageKey: `k-${id}`,
    availableAt: new Date(Date.UTC(year, month - 1, 28)), createdAt: new Date(Date.UTC(year, month - 1, 28)),
  });
}

function setUp() {
  const all = [payslipOf('feb', 2026, 2), payslipOf('jan', 2026, 1), payslipOf('dec', 2025, 12), payslipOf('other', 2026, 1, 'u2')];
  const payslips = new InMemoryPayslipRepository(new Map(all.map((payslip) => [payslip.id, payslip])));
  const files = new InMemoryPayslipFileStorage(new Map(all.map((payslip) => [payslip.storageKey, pdf])));
  return {
    list: new ListPayslipsUseCase(payslips),
    view: new ViewPayslipUseCase(payslips, files),
    download: new DownloadPayslipUseCase(payslips, files),
    export: new ExportPayslipsUseCase(payslips, files),
  };
}

describe('ListPayslipsUseCase', () => {
  it('lists the payslips of the signed-in employee for a year, January to December', async () => {
    const list = await setUp().list.execute({ actor: employee, criteria: { year: 2026 } });

    expect(list).toMatchObject({ items: [{ id: 'jan' }, { id: 'feb' }], total: 3, years: [2025, 2026] });
  });

  it('refuses an actor outside any company', async () => {
    await expect(
      setUp().list.execute({ actor: { ...employee, companyId: null }, criteria: { year: null } }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('ViewPayslipUseCase and DownloadPayslipUseCase', () => {
  it('hand back a link to the file, with the name to save it under and its type', async () => {
    const { view, download } = setUp();
    const expected = { payslipId: 'jan', url: pdfUrl, fileName: 'Bulletin_2026-1.pdf', contentType: 'application/pdf' };

    await expect(view.execute({ actor: employee, payslipId: 'jan' })).resolves.toEqual(expected);
    await expect(download.execute({ actor: employee, payslipId: 'jan' })).resolves.toEqual(expected);
  });

  it.each([
    ['the payslip of a colleague', 'other'],
    ['an unknown payslip', 'missing'],
  ])('refuse %s', async (_what, payslipId) => {
    const { view, download } = setUp();

    await expect(view.execute({ actor: employee, payslipId })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await expect(download.execute({ actor: employee, payslipId })).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('ExportPayslipsUseCase', () => {
  it('hands back the download link of every payslip of the year, January first', async () => {
    const links = await setUp().export.execute({ actor: employee, criteria: { year: 2026 } });

    expect(links.map((link) => [link.payslipId, link.fileName])).toEqual([
      ['jan', 'Bulletin_2026-1.pdf'],
      ['feb', 'Bulletin_2026-2.pdf'],
    ]);
  });

  it('exports nothing of a colleague', async () => {
    const links = await setUp().export.execute({ actor: { ...employee, userId: 'u3' }, criteria: { year: null } });

    expect(links).toEqual([]);
  });
});
