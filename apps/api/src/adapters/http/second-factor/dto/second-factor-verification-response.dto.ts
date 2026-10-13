import { ApiProperty } from '@nestjs/swagger';

export class SecondFactorVerificationResponseDto {
  @ApiProperty()
  verified!: boolean;
}
