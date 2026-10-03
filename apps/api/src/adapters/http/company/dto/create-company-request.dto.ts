import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyRequestDto {
  @ApiProperty({ example: 'Acme RH' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
