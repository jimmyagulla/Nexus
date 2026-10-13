import { ApiProperty } from '@nestjs/swagger';

export class ReceiptResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fileName!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty({ description: 'Size of the file in bytes' })
  size!: number;

  @ApiProperty({ nullable: true, type: String })
  expenseId!: string | null;
}
