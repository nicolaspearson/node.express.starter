import { IsEmail, IsString, Length } from 'class-validator';

export default class UserLoginDto {
  @IsString()
  @IsEmail()
  @Length(1, 500)
  public emailAddress: string;

  @IsString()
  @Length(6, 500)
  public password: string;
}
