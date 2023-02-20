import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateProductDTO {
    @IsNotEmpty()
    @ApiProperty({description: 'required'})
    readonly name: string
    @IsNotEmpty()
    @ApiProperty({description: 'required, url of the image'})
    readonly image: string
    @IsNotEmpty()
    @ApiProperty({description: 'required'})
    readonly price: string
    @IsNotEmpty()
    @ApiProperty({description: 'required, voir les marques disponibles dans la base de données'})
    readonly brand: string
    @IsNotEmpty()
    @ApiProperty({description: 'required'})
    readonly description: string
    @IsNotEmpty()
    @ApiProperty({description: 'required'})
    readonly stock: number
    @IsNotEmpty()
    @ApiProperty({description: 'required, voir les categories disponibles dans la base de données'})
    readonly category: string
    @IsNotEmpty()
    @ApiProperty({description: 'required, voir les sizes disponibles dans la base de données'})
    readonly size: string
}

export class CreateReductionDTO {
    @IsNotEmpty()
    @ApiProperty({description: 'required, id of the product'})
    readonly id: string
    @IsNotEmpty()
    @ApiProperty({description: 'required, reduction in %'})
    readonly reduction: number
}

export class RemoveReductionDTO {
    @IsNotEmpty()
    @ApiProperty({description: 'required, id of the product'})
    readonly id: string
}