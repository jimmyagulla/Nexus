import { ApiProperty } from '@nestjs/swagger';

export class SecondFactorEnrollmentResponseDto {
  @ApiProperty()
  secret!: string;

  @ApiProperty()
  provisioningUri!: string;
}
