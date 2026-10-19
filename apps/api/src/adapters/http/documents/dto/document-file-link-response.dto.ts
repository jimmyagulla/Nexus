import { ApiProperty } from '@nestjs/swagger';

export class DocumentFileLinkResponseDto {
  @ApiProperty({ description: 'Signed link, valid for a short while' })
  url!: string;

  @ApiProperty({ description: 'Name to save the file under, extension included' })
  fileName!: string;

  @ApiProperty({ example: 'application/pdf' })
  contentType!: string;
}
