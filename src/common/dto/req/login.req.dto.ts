import { IsEmail, IsString, Length } from 'class-validator';

export class LoginReqDto {
  @IsString()
  @IsEmail()
  @Length(1, 75)
  public email: Email;

  @IsString()
  @Length(6, 50)
  public password: string;
}
