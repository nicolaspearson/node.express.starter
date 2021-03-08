import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindUserByIdReqDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id!: number;
}
