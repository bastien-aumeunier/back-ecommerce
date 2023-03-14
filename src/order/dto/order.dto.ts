import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateOrderDTO {
    @IsNotEmpty()
    @ApiProperty({description: `Cart ID`})
    cartID: string;

    @IsNotEmpty()
    @ApiProperty({description: `Adresse ID`})
    addressID: string
}