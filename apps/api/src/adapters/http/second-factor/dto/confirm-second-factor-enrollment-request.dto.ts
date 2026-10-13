import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmSecondFactorEnrollmentRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  enrollmentId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code!: string;
}
