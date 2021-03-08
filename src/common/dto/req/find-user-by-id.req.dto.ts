import { IsNotEmpty, IsNumberString } from 'class-validator';

export class FindUserByIdReqDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly id!: number | string;
}
