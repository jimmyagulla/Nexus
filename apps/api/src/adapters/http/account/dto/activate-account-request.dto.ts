import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateAccountRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  invitationToken!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secret!: string;
}
