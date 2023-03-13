import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ATCDTO {
    @IsNotEmpty()
    @ApiProperty({description: `ProductID`})
    productId: string;
}

export class ConvertCartDTO{
    @IsNotEmpty()
    @ApiProperty({description: 'list of ProductID'})
    products : string[];
}
