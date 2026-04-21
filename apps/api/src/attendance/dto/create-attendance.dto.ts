import { IsArray, IsDateString, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceEntryDto } from './attendance-entry.dto';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  teacherClassId!: string;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceEntryDto)
  entries!: AttendanceEntryDto[];
}