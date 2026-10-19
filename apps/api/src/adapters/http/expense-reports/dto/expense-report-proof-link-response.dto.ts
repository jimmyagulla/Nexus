import { ApiProperty } from '@nestjs/swagger';

export class ExpenseReportProofLinkResponseDto {
  @ApiProperty({ description: 'Signed link, valid for a short while' })
  url!: string;

  @ApiProperty({ description: 'Name of the receipt, extension included' })
  fileName!: string;

  @ApiProperty({ example: 'application/pdf' })
  contentType!: string;
}
