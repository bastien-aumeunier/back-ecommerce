import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ATCDTO {
    @IsNotEmpty()
    @ApiProperty({description: `ProductID`})
    productId: string;
}

export class ConvertCartDTO{
    @IsNotEmpty()
    @ApiProperty({description: 'ProductID'})
    productId : string;
    @IsNotEmpty()
    @ApiProperty({description: 'quantity'})
    productQuantity : number;
}

export class ListConvertCartDTO{
    @IsNotEmpty()
    @ApiProperty({description: 'list of ConvertCartDTO'})
    products : ConvertCartDTO[];
}
