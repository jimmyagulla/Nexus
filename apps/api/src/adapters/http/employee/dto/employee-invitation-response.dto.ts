import { ApiProperty } from '@nestjs/swagger';

export class EmployeeInvitationResponseDto {
  @ApiProperty()
  employeeId!: string;

  @ApiProperty()
  accountId!: string;

  @ApiProperty()
  identifier!: string;

  @ApiProperty()
  invitationToken!: string;
}
