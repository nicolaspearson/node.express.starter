import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterUserReqDto {
  @IsString()
  @IsEmail()
  @Length(1, 75)
  public email: Email;

  @IsString()
  @Length(1, 100)
  public firstName: string;

  @IsString()
  @Length(1, 100)
  public lastName: string;

  @IsString()
  @Length(6, 50)
  public password: string;
}
