import { ApiProperty } from '@nestjs/swagger';
import { DocumentFileFormat } from '@hexagonal-monorepo-template/domain';

export class PayslipSummaryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 2026 })
  year!: number;

  @ApiProperty({ description: '1 = January', minimum: 1, maximum: 12 })
  month!: number;

  @ApiProperty()
  employerName!: string;

  @ApiProperty()
  fileName!: string;

  @ApiProperty({ enum: DocumentFileFormat })
  format!: DocumentFileFormat;

  @ApiProperty()
  sizeBytes!: number;

  @ApiProperty({ description: 'ISO 8601 instant the payslip was made available' })
  availableAt!: string;
}
