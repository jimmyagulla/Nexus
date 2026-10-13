import { ApiProperty } from '@nestjs/swagger';

export class SecondFactorEnrollmentConfirmationResponseDto {
  @ApiProperty()
  enrolled!: boolean;
}
