import {
  DownloadPayslipFromSessionUseCase,
  ExportPayslipsFromSessionUseCase,
  ListPayslipsFromSessionUseCase,
  ViewPayslipFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import { SystemClock } from '@hexagonal-monorepo-template/adapters';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { ApiPayslipGateway } from '../../../adapters/gateways/api-payslip.gateway';
import { PayslipsController } from '../../../adapters/controllers/payslips.controller';

/** The payslips controller, wired to the API: for the payslips screen and the shell badge. */
export function createPayslipsController(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): PayslipsController {
  const payslips = new ApiPayslipGateway(httpClient);
  return new PayslipsController(
    new ListPayslipsFromSessionUseCase(sessions, payslips),
    new ViewPayslipFromSessionUseCase(sessions, payslips),
    new DownloadPayslipFromSessionUseCase(sessions, payslips),
    new ExportPayslipsFromSessionUseCase(sessions, payslips),
    new SystemClock(),
  );
}
