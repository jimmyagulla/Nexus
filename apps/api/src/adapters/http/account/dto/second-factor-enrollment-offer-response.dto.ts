import { ApiProperty } from '@nestjs/swagger';

export class SecondFactorEnrollmentOfferResponseDto {
  @ApiProperty()
  enrollmentId!: string;

  @ApiProperty()
  secret!: string;

  @ApiProperty()
  provisioningUri!: string;
}
