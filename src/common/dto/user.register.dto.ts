import { IsEmail, IsString, Length } from 'class-validator';

export default class RegisterUserDto {
  @IsString()
  @Length(1, 500)
  public firstName: string;

  @IsString()
  @Length(1, 500)
  public lastName: string;

  @IsString()
  @IsEmail()
  @Length(1, 500)
  public emailAddress: string;

  @IsString()
  @Length(6, 500)
  public password: string;
}
