import { ApiProperty } from '@nestjs/swagger';

export class ExchangeDocumentResponseDto {
  @ApiProperty()
  fileName!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  size!: number;
}
