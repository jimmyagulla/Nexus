import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AttachReceiptRequestDto {
  @ApiProperty()
  @IsString()
  fileName!: string;

  @ApiProperty({ description: 'PDF, JPEG or PNG' })
  @IsString()
  mimeType!: string;

  @ApiProperty({ description: 'File content encoded in base64' })
  @IsString()
  contentBase64!: string;

  @ApiPropertyOptional({
    description: 'Expense the receipt proves, if not the report as a whole',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  expenseId?: string | null;
}
