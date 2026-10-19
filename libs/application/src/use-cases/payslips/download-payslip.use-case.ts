import {
  ActorContext,
  PayslipFileLink,
  requireOwnedPayslip,
} from '@hexagonal-monorepo-template/domain';
import {
  IDownloadPayslip,
  IPayslipFileStorage,
  IPayslipRepository,
} from '@hexagonal-monorepo-template/ports';
import { linkToPayslip } from '../../payslips/link-to-payslip';

export class DownloadPayslipUseCase implements IDownloadPayslip {
  constructor(
    private readonly payslips: IPayslipRepository,
    private readonly files: IPayslipFileStorage,
  ) {}

  async execute(input: {
    actor: ActorContext;
    payslipId: string;
  }): Promise<PayslipFileLink> {
    const payslip = requireOwnedPayslip(
      await this.payslips.findById(input.payslipId),
      input.actor,
    );
    return linkToPayslip(this.files, payslip, { download: true });
  }
}
