import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmSecondFactorRequestDto {
  @ApiProperty()
  @IsString()
  code!: string;
}
