import { ApiProperty } from '@nestjs/swagger';
import { AbsenceEntryResponseDto } from './absence-entry-response.dto';
import { OvertimeEntryResponseDto } from './overtime-entry-response.dto';
import { SickLeaveEntryResponseDto } from './sick-leave-entry-response.dto';

export class PresenceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  employeeId!: string;

  @ApiProperty()
  employeeName!: string;

  @ApiProperty()
  month!: string;

  @ApiProperty()
  workedDays!: number;

  @ApiProperty({ type: [AbsenceEntryResponseDto] })
  leaves!: AbsenceEntryResponseDto[];

  @ApiProperty({ type: [AbsenceEntryResponseDto] })
  absences!: AbsenceEntryResponseDto[];

  @ApiProperty({ type: [SickLeaveEntryResponseDto] })
  sickLeaves!: SickLeaveEntryResponseDto[];

  @ApiProperty({ type: [OvertimeEntryResponseDto] })
  overtime!: OvertimeEntryResponseDto[];
}
