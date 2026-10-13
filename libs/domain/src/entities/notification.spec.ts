import { UserRole } from '../identity/user-role';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile } from '../value-objects/exchange-file';
import { CabinetExchange } from './cabinet-exchange';
import { Notification } from './notification';
import { NotificationType } from './notification-type';

const at = new Date('2026-10-06T10:00:00.000Z');
const file = ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1]));
const category = ExchangeCategory.parse('Facture');

describe('Notification', () => {
  it('tells the cabinet that a document of the company was received', () => {
    const received = CabinetExchange.draft('ex-1', 'c1', 'user-1', at)
      .withCategory(category)
      .withDocument(file)
      .markToTransmit()
      .transmit('user-1', at)
      .receive(at);

    expect(Notification.exchangeReceived('n-1', received, at)).toEqual({
      id: 'n-1',
      type: NotificationType.CABINET_DOCUMENT_RECEIVED,
      companyId: 'c1',
      recipientRole: UserRole.ACCOUNTANT,
      targetId: 'ex-1',
      createdAt: at,
      readAt: null,
    });
  });

  it('tells the employers that the cabinet deposited a document', () => {
    const deposited = CabinetExchange.deposit(
      'ex-2',
      'c1',
      'cab-1',
      category,
      file,
      at,
    ).receive(at);

    const notification = Notification.exchangeReceived('n-2', deposited, at);

    expect(notification.recipientRole).toBe(UserRole.EMPLOYER);
    expect(notification.targetId).toBe('ex-2');
  });

  it('is never meant for an employee', () => {
    const received = CabinetExchange.deposit(
      'ex-3',
      'c1',
      'cab-1',
      category,
      file,
      at,
    ).receive(at);

    expect(
      Notification.exchangeReceived('n-3', received, at).recipientRole,
    ).not.toBe(UserRole.EMPLOYEE);
  });

  it('is unread when created', () => {
    const received = CabinetExchange.deposit(
      'ex-4',
      'c1',
      'cab-1',
      category,
      file,
      at,
    ).receive(at);

    expect(Notification.exchangeReceived('n-4', received, at).readAt).toBeNull();
  });
});
