import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceEntryDto } from './attendance-entry.dto';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  lessonInstanceId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceEntryDto)
  entries!: AttendanceEntryDto[];
}
