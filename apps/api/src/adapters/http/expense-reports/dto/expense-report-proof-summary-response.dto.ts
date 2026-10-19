import { ApiProperty } from '@nestjs/swagger';
import { DocumentFileFormat } from '@hexagonal-monorepo-template/domain';

export class ExpenseReportProofSummaryResponseDto {
  @ApiProperty()
  fileName!: string;

  @ApiProperty({ enum: [DocumentFileFormat.PDF, DocumentFileFormat.JPEG, DocumentFileFormat.PNG] })
  format!: DocumentFileFormat;

  @ApiProperty()
  sizeBytes!: number;
}
