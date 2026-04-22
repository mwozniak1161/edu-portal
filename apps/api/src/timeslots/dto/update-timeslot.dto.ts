import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min, Matches } from 'class-validator';

export class UpdateTimeslotDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  teacherClassId?: string;

  @ApiProperty({ required: false, description: '1=Monday … 7=Sunday' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  weekDay?: number;

  @ApiProperty({ required: false, example: '08:00:00', description: 'Time in HH:MM:SS format' })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, {
    message: 'startingHour must be a time string HH:MM or HH:MM:SS',
  })
  startingHour?: string;
}
