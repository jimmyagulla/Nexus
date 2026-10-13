import { CabinetConnectionStatus } from './cabinet-connection-status';

export class CabinetConnection {
  constructor(
    readonly companyId: string,
    readonly status: CabinetConnectionStatus,
  ) {}

  isConnected(): boolean {
    return this.status === CabinetConnectionStatus.CONNECTED;
  }
}
