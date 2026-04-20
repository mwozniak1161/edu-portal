import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength, Matches, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '../../generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email!: string;

  @ApiProperty({ example: 'Password1!', minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'password must contain at least one uppercase letter and one number',
  })
  password!: string;

  @ApiProperty({ example: 'Jane' })
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  lastName!: string;

  @ApiProperty({ enum: Role, example: Role.STUDENT })
  @IsEnum(Role)
  role!: Role;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'uuid-of-class' })
  @IsOptional()
  @IsUUID()
  classId?: string;
}
