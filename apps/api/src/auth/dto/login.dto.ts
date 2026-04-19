import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email!: string;

  @ApiProperty({ example: 'Password1!' })
  @IsString()
  password!: string;
}
