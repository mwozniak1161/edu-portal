import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateLessonInstancesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  teacherClassId!: string;

  @ApiProperty({ example: '2024-03-15' })
  @IsNotEmpty()
  @IsDateString()
  date!: string;
}
