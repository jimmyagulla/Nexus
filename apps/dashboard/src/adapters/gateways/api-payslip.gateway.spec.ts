import { describe, expect, it } from 'vitest';
import { InMemoryHttpClient } from '../../infrastructure/network/in-memory-http-client';
import { ApiPayslipGateway } from './api-payslip.gateway';

const authorized = { headers: { Authorization: 'Bearer token' } };
const link = { payslipId: 'p1', url: 'https://storage/p1', fileName: 'Bulletin.pdf', contentType: 'application/pdf' };

describe('ApiPayslipGateway', () => {
  it('asks for the payslips of a year on behalf of the session', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/payslips?year=2026', { status: 200, data: { items: [], total: 0, years: [] } });

    await expect(new ApiPayslipGateway(http).list('c1', { year: 2026 }, 'token')).resolves.toEqual({ items: [], total: 0, years: [] });
    expect(http.calls[0].config).toEqual(authorized);
  });

  it('asks for every year without a year in the query string', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/payslips', { status: 200, data: { items: [], total: 0, years: [] } });

    await new ApiPayslipGateway(http).list('c1', { year: null }, 'token');

    expect(http.calls.map((call) => call.url)).toEqual(['companies/c1/payslips']);
  });

  it('reads the link to open, then to download, a payslip', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/payslips/p1/view', { status: 200, data: link });
    http.reply('get', 'companies/c1/payslips/p1/download', { status: 200, data: link });
    const gateway = new ApiPayslipGateway(http);

    await expect(gateway.view('c1', 'p1', 'token')).resolves.toEqual(link);
    await expect(gateway.download('c1', 'p1', 'token')).resolves.toEqual(link);
  });

  it('reads the download links of every payslip of a year', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/payslips/export?year=2026', { status: 200, data: [link] });

    await expect(new ApiPayslipGateway(http).export('c1', { year: 2026 }, 'token')).resolves.toEqual([link]);
  });
});
