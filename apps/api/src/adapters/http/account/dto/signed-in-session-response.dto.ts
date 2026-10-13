import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@hexagonal-monorepo-template/domain';

export class SignedInSessionResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  companyId!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;
}
