import { describe, expect, it } from 'vitest';
import { InMemoryHttpClient } from '../../infrastructure/network/in-memory-http-client';
import { ApiPersonalInfoGateway } from './api-personal-info.gateway';

const authorized = { headers: { Authorization: 'Bearer token' } };
const contact = { address: '14 rue des Tilleuls', postalCodeAndCity: '34000 Montpellier', phone: '06 12 34 56 47', email: 'camille.martin@mail.fr' };
const snapshot = { employeeId: 'u1', contact, employment: {}, updatedAt: '2026-06-12T08:00:00.000Z' };

describe('ApiPersonalInfoGateway', () => {
  it('reads the information of an employee on behalf of the session', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/employees/u1/personal-info', { status: 200, data: snapshot });

    await expect(new ApiPersonalInfoGateway(http).get('c1', 'u1', 'token')).resolves.toEqual(snapshot);
    expect(http.calls[0].config).toEqual(authorized);
  });

  it('sends the four contact details, and reads back the information', async () => {
    const http = new InMemoryHttpClient();
    http.reply('patch', 'companies/c1/employees/u1/personal-info', { status: 200, data: snapshot });

    await expect(new ApiPersonalInfoGateway(http).updateContact('c1', 'u1', contact, 'token')).resolves.toEqual(snapshot);
    expect(http.calls).toEqual([{ method: 'patch', url: 'companies/c1/employees/u1/personal-info', data: contact, config: authorized }]);
  });
});
