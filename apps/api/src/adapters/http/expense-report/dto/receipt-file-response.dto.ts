import { ApiProperty } from '@nestjs/swagger';

export class ReceiptFileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fileName!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty({ description: 'File content encoded in base64' })
  contentBase64!: string;
}
