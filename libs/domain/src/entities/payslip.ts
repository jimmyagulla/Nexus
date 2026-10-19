import {
  DocumentFileFormat,
  fileNameWithExtension,
} from '../value-objects/document-file-format';
import { PayslipEmployerName } from '../value-objects/payslip-employer-name';
import { PayslipFileName } from '../value-objects/payslip-file-name';
import { PayslipPeriod } from '../value-objects/payslip-period';

export type PayslipProps = {
  id: string;
  companyId: string;
  /** The employee the payslip is paid to. */
  employeeId: string;
  /** The person from the employer who made it available. */
  uploadedById: string;
  employerName: PayslipEmployerName;
  period: PayslipPeriod;
  /** Net pay, in euro cents. */
  netPayCents: number;
  fileName: PayslipFileName;
  format: DocumentFileFormat;
  sizeBytes: number;
  /** Key of the file in the payslip storage. */
  storageKey: string;
  /** When the employee could first reach it. */
  availableAt: Date;
  createdAt: Date;
};

export class Payslip {
  constructor(private readonly props: PayslipProps) {}

  get id(): string {
    return this.props.id;
  }

  get companyId(): string {
    return this.props.companyId;
  }

  get employeeId(): string {
    return this.props.employeeId;
  }

  get uploadedById(): string {
    return this.props.uploadedById;
  }

  get employerName(): PayslipEmployerName {
    return this.props.employerName;
  }

  get period(): PayslipPeriod {
    return this.props.period;
  }

  get netPayCents(): number {
    return this.props.netPayCents;
  }

  get fileName(): PayslipFileName {
    return this.props.fileName;
  }

  get format(): DocumentFileFormat {
    return this.props.format;
  }

  get sizeBytes(): number {
    return this.props.sizeBytes;
  }

  get storageKey(): string {
    return this.props.storageKey;
  }

  get availableAt(): Date {
    return this.props.availableAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  /** File name a download saves: the file name, with its extension. */
  get downloadName(): string {
    return fileNameWithExtension(this.props.fileName.value, this.props.format);
  }

  isOwnedBy(companyId: string | null, userId: string): boolean {
    return this.props.companyId === companyId && this.props.employeeId === userId;
  }
}
