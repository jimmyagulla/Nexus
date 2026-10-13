import { ApiProperty } from '@nestjs/swagger';

export class ExchangeFileResponseDto {
  @ApiProperty()
  fileName!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty({ description: 'File content, base64 encoded' })
  contentBase64!: string;
}
