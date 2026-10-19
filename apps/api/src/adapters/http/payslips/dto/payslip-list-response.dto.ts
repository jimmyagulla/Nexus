import { ApiProperty } from '@nestjs/swagger';
import { PayslipSummaryResponseDto } from './payslip-summary-response.dto';

export class PayslipListResponseDto {
  @ApiProperty({ type: [PayslipSummaryResponseDto], description: 'January to December' })
  items!: PayslipSummaryResponseDto[];

  @ApiProperty({ description: 'Every payslip of the employee, whatever the year' })
  total!: number;

  @ApiProperty({ type: [Number], description: 'Years with a payslip, oldest first' })
  years!: number[];
}
