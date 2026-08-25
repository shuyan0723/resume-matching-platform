import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '邮箱' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @MinLength(6, { message: '密码至少6位' })
  @MaxLength(50, { message: '密码不能超过50位' })
  password: string;
}
