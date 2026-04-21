import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonInstanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  teacherClassId!: string;

  @ApiProperty({ example: '2024-03-15' })
  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
