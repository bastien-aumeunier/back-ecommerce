import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class CreateAddressDTO {
    @IsNotEmpty()
    @ApiProperty({description: `nom de l'address`})
    addressName: string;

    @IsNotEmpty()
    @ApiProperty({description: `Mr ou Ms`})
    civility: string;

    @IsNotEmpty()
    @ApiProperty({description: `Nom du destinataire`})
    userName: string;

    @IsNotEmpty()
    @ApiProperty({description: `Prénom du destinataire`})
    userFirstName: string;
    
    @IsNotEmpty()
    @ApiProperty({description: `numéro de l'adresse`})
    addressNumber: string;

    @IsNotEmpty()
    @ApiProperty({description: `nom de la rue`})
    address:string;

    @IsNotEmpty()
    @ApiProperty({description: `code postal`})
    postalCode: string;

    @IsNotEmpty()
    @ApiProperty({description: `ville`})
    city: string;

    @IsNotEmpty()
    @ApiProperty({description: `pays`})
    country: string;

    @IsNotEmpty()
    @Length(10)
    @ApiProperty({description: `numéro de tel`})
    tel: string;

}

export class RemoveAddressDTO{
    @IsNotEmpty()
    @ApiProperty({description: `id de l'adresse`})
    addressID: string;
}