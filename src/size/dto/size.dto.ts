import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateSizeDTO {
    @IsNotEmpty()
    @ApiProperty({description: 'required'})
    readonly category: string

    @IsNotEmpty()
    @ApiProperty({description: 'required'})
    readonly size: string
}