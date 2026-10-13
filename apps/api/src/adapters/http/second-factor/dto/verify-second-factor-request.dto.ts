import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifySecondFactorRequestDto {
  @ApiProperty({ description: 'The usual code or a recovery code' })
  @IsString()
  code!: string;
}
