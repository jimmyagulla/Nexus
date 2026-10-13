import { ApiProperty } from '@nestjs/swagger';
import { SecondFactorStep } from '@hexagonal-monorepo-template/domain';

export class SecondFactorStatusResponseDto {
  @ApiProperty({ enum: SecondFactorStep })
  step!: SecondFactorStep;
}
