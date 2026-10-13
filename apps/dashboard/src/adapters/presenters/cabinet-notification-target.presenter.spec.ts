import { describe, expect, it } from 'vitest';
import {
  Notification,
  NotificationType,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { AppRoutes } from '../../infrastructure/ui/routes/app-routes';
import { CabinetNotificationTargetPresenter } from './cabinet-notification-target.presenter';

const at = new Date('2026-10-06T10:00:00.000Z');

const received = new Notification(
  'n-1',
  NotificationType.CABINET_DOCUMENT_RECEIVED,
  'c1',
  UserRole.ACCOUNTANT,
  'ex-42',
  at,
  null,
);

describe('CabinetNotificationTargetPresenter', () => {
  it('leads the document received notification to the exchange itself', () => {
    expect(new CabinetNotificationTargetPresenter().present(received)).toEqual({
      to: AppRoutes.exchange,
      params: { exchangeId: 'ex-42' },
    });
  });

  it('leads to the same exchange for the employer notified of a deposit', () => {
    const deposit = new Notification(
      'n-2',
      NotificationType.CABINET_DOCUMENT_RECEIVED,
      'c1',
      UserRole.EMPLOYER,
      'ex-43',
      at,
      null,
    );

    expect(
      new CabinetNotificationTargetPresenter().present(deposit).params,
    ).toEqual({ exchangeId: 'ex-43' });
  });
});
