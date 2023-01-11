import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email field',
    default: 'some@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
