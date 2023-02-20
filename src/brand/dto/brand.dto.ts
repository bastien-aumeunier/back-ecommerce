import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBrandDTO {
    @IsNotEmpty()
    @ApiProperty({description: 'required'})
    readonly name: string
}