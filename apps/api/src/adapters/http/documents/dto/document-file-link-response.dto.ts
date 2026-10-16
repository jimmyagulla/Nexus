import { ApiProperty } from '@nestjs/swagger';

export class DocumentFileLinkResponseDto {
  @ApiProperty({ description: 'Signed link, valid for a short while' })
  url!: string;
}
