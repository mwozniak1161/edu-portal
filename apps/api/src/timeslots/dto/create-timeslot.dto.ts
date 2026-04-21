import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max, Matches, IsOptional } from 'class-validator';

export class CreateTimeslotDto {
  @ApiProperty({ example: 'uuid-of-teacher-class', required: false })
  @IsUUID()
  @IsOptional()
  teacherClassId?: string;

  @ApiProperty({ example: 1, description: '1=Monday … 7=Sunday' })
  @IsInt()
  @Min(1)
  @Max(7)
  weekDay!: number;

  @ApiProperty({ example: '08:00:00', description: 'Time in HH:MM:SS format' })
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, { message: 'startingHour must be a time string HH:MM or HH:MM:SS' })
  startingHour!: string;
}
