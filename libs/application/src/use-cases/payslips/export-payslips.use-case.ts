import {
  ActorContext,
  PayslipFileLink,
  PayslipListCriteria,
  requireOwnerScope,
} from '@hexagonal-monorepo-template/domain';
import {
  IExportPayslips,
  IPayslipFileStorage,
  IPayslipRepository,
} from '@hexagonal-monorepo-template/ports';
import { linkToPayslip } from '../../payslips/link-to-payslip';

export class ExportPayslipsUseCase implements IExportPayslips {
  constructor(
    private readonly payslips: IPayslipRepository,
    private readonly files: IPayslipFileStorage,
  ) {}

  async execute(input: {
    actor: ActorContext;
    criteria: PayslipListCriteria;
  }): Promise<PayslipFileLink[]> {
    const payslips = await this.payslips.findAll(
      requireOwnerScope(input.actor),
      input.criteria,
    );
    return Promise.all(
      payslips.map((payslip) =>
        linkToPayslip(this.files, payslip, { download: true }),
      ),
    );
  }
}
