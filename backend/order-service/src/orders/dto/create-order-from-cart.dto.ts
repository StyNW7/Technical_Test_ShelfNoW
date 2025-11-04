import { IsString, IsObject, IsNotEmpty, IsOptional } from 'class-validator';

export class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

export class CreateOrderFromCartDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsObject()
  @IsOptional()
  paymentDetails?: any;

  @IsObject()
  @IsNotEmpty()
  shippingAddress: ShippingAddressDto;
}