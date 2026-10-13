import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InviteEmployeeRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier!: string;
}
