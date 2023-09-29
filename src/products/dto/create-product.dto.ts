import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly price: number;
  @IsNotEmpty()
  readonly userId: string;
  @IsNotEmpty()
  readonly password: string;
}
