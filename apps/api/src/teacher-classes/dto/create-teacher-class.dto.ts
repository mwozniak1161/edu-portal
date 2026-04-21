import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateTeacherClassDto {
  @ApiProperty({ example: 'uuid-of-teacher' })
  @IsUUID()
  teacherId!: string;

  @ApiProperty({ example: 'uuid-of-subject' })
  @IsUUID()
  subjectId!: string;

  @ApiProperty({ example: 'uuid-of-class' })
  @IsUUID()
  classId!: string;
}
