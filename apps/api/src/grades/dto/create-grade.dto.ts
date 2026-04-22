import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateGradeDto {
  @ApiProperty({ minimum: 1, maximum: 6 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(6)
  @Type(() => Number)
  value!: number;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  weight?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  studentId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  teacherClassId!: string;
}
