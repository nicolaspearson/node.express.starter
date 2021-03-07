import { IsNotEmpty, IsNumber } from 'class-validator';

export default class IdDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id!: number;
}
