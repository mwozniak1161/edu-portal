import { IsEnum, IsNotEmpty } from 'class-validator';
import { AttendanceStatus } from '../../generated/prisma/enums';

export class AttendanceEntryDto {
  @IsNotEmpty()
  studentId!: string;

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;
}