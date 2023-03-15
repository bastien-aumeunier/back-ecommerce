import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddFavorisDTO {
    @ApiProperty({description: 'UUID of product'})
    @IsNotEmpty()
    productID: string;
}