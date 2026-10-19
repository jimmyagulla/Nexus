import { FixedClock, InMemorySessionGateway } from '@hexagonal-monorepo-template/adapters';
import {
  DownloadPayslipFromSessionUseCase,
  ExportPayslipsFromSessionUseCase,
  ListPayslipsFromSessionUseCase,
  ViewPayslipFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { ApiPayslipGateway } from '../gateways/api-payslip.gateway';
import { InMemoryHttpClient } from '../../infrastructure/network/in-memory-http-client';
import { PayslipsController } from './payslips.controller';

const link = { payslipId: 'p1', url: 'https://storage/p1', fileName: 'Bulletin.pdf', contentType: 'application/pdf' };

function controllerWith(http = new InMemoryHttpClient()): PayslipsController {
  const sessions = new InMemorySessionGateway('token', { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE });
  const gateway = new ApiPayslipGateway(http);
  return new PayslipsController(
    new ListPayslipsFromSessionUseCase(sessions, gateway),
    new ViewPayslipFromSessionUseCase(sessions, gateway),
    new DownloadPayslipFromSessionUseCase(sessions, gateway),
    new ExportPayslipsFromSessionUseCase(sessions, gateway),
    new FixedClock(new Date('2026-10-19T10:00:00')),
  );
}

describe('PayslipsController', () => {
  it('opens on the latest year with a payslip until a year is chosen', () => {
    expect(controllerWith().criteriaFor({ year: null }, [2024, 2025])).toEqual({ year: 2025 });
  });

  it('opens on the current year when the employee has no payslip yet', () => {
    expect(controllerWith().criteriaFor({ year: null }, [])).toEqual({ year: 2026 });
  });

  it('keeps the year the person chose, even before the years are known', () => {
    expect(controllerWith().criteriaFor({ year: 2024 }, undefined)).toEqual({ year: 2024 });
  });

  it('knows no default year while the years load', () => {
    expect(controllerWith().criteriaFor({ year: null }, undefined)).toBeNull();
  });

  it('lists, opens, downloads and exports through the API of the session', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/payslips?year=2026', { status: 200, data: { items: [], total: 0, years: [] } });
    http.reply('get', 'companies/c1/payslips/p1/view', { status: 200, data: link });
    http.reply('get', 'companies/c1/payslips/p1/download', { status: 200, data: link });
    http.reply('get', 'companies/c1/payslips/export?year=2026', { status: 200, data: [link] });
    const controller = controllerWith(http);

    await expect(controller.listPayslips({ year: 2026 })).resolves.toEqual({ items: [], total: 0, years: [] });
    await expect(controller.viewPayslip('p1')).resolves.toEqual(link);
    await expect(controller.downloadPayslip('p1')).resolves.toEqual(link);
    await expect(controller.exportPayslips({ year: 2026 })).resolves.toEqual([link]);
  });
});
