import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;
}
