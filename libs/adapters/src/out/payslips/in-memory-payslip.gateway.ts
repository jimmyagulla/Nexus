import {
  comparePayslips,
  documentFileFormatSpec,
  ErrorCode,
  matchesPayslipListCriteria,
  Payslip,
  PayslipFileLink,
  PayslipList,
  PayslipListCriteria,
  toPayslipList,
} from '@hexagonal-monorepo-template/domain';
import { toDataUrl } from '@hexagonal-monorepo-template/infrastructure';
import { IPayslipGateway } from '@hexagonal-monorepo-template/ports';

/** A payslip of the in-memory API, with its file. */
export type InMemoryApiPayslip = {
  payslip: Payslip;
  content: Uint8Array;
};

/**
 * The payslips of the API, kept in the process. A token stands for the
 * employee it was issued to, who only reaches their own payslips. A link is a
 * `data:` URL carrying the file itself.
 */
export class InMemoryPayslipGateway implements IPayslipGateway {
  constructor(private readonly payslips = new Map<string, InMemoryApiPayslip>()) {}

  async list(
    companyId: string,
    criteria: PayslipListCriteria,
    token: string,
  ): Promise<PayslipList> {
    return toPayslipList(this.ownedBy(companyId, token).map(({ payslip }) => payslip), criteria);
  }

  async view(companyId: string, payslipId: string, token: string): Promise<PayslipFileLink> {
    return this.linkTo(this.owned(companyId, payslipId, token));
  }

  async download(companyId: string, payslipId: string, token: string): Promise<PayslipFileLink> {
    return this.linkTo(this.owned(companyId, payslipId, token));
  }

  async export(
    companyId: string,
    criteria: PayslipListCriteria,
    token: string,
  ): Promise<PayslipFileLink[]> {
    return this.ownedBy(companyId, token)
      .filter(({ payslip }) => matchesPayslipListCriteria(payslip, criteria))
      .sort((left, right) => comparePayslips(left.payslip, right.payslip))
      .map((stored) => this.linkTo(stored));
  }

  private ownedBy(companyId: string, token: string): InMemoryApiPayslip[] {
    return [...this.payslips.values()].filter(({ payslip }) => payslip.isOwnedBy(companyId, token));
  }

  /** A payslip of someone else is refused exactly like a missing one. */
  private owned(companyId: string, payslipId: string, token: string): InMemoryApiPayslip {
    const stored = this.payslips.get(payslipId);
    if (stored === undefined || !stored.payslip.isOwnedBy(companyId, token)) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return stored;
  }

  private linkTo({ payslip, content }: InMemoryApiPayslip): PayslipFileLink {
    const contentType = documentFileFormatSpec(payslip.format).mimeType;
    return {
      payslipId: payslip.id,
      url: toDataUrl(contentType, content),
      fileName: payslip.downloadName,
      contentType,
    };
  }
}
