import { IsUUID, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  userId: string;

  @IsNotEmpty()
  password: string;

  @IsNumber()
  quantity: number;
}
