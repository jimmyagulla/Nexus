import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { SubmitExpenseReportRequestDto } from './submit-expense-report-request.dto';

/** Text fields of a change of an expense report. A new receipt travels in the `proof` part. */
export class ReviseExpenseReportRequestDto extends SubmitExpenseReportRequestDto {
  @ApiProperty({
    enum: ['true', 'false'],
    description: 'Without a new receipt: keep the one attached (true) or remove it (false)',
  })
  @IsIn(['true', 'false'])
  keepProof!: 'true' | 'false';
}
