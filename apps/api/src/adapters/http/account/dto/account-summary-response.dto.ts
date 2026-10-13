import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus, UserRole } from '@hexagonal-monorepo-template/domain';

export class AccountSummaryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identifier!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty({ enum: AccountStatus })
  status!: AccountStatus;

  @ApiProperty()
  locked!: boolean;
}
