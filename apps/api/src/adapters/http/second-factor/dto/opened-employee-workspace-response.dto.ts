import { ApiProperty } from '@nestjs/swagger';
import { SignedInSessionResponseDto } from '../../account/dto/signed-in-session-response.dto';
import { EmployeeSummaryResponseDto } from './employee-summary-response.dto';

export class OpenedEmployeeWorkspaceResponseDto {
  @ApiProperty({ type: SignedInSessionResponseDto })
  session!: SignedInSessionResponseDto;

  @ApiProperty({ type: EmployeeSummaryResponseDto })
  employee!: EmployeeSummaryResponseDto;
}
