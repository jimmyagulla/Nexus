import { ApiProperty } from '@nestjs/swagger';

export class SecondFactorEnrollmentConfirmationResponseDto {
  @ApiProperty()
  enrolled!: boolean;

  @ApiProperty({ type: [String] })
  recoveryCodes!: string[];
}
