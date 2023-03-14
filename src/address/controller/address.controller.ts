import { Role } from 'src/user/entity/user.entity';
import { Controller, Get, Request, UseGuards, UnauthorizedException, Body, Post, UsePipes, ValidationPipe, Res, Delete, NotFoundException, Param, ForbiddenException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAddressDTO, RemoveAddressDTO } from './../dto/address.dto';
import { JwtAuthGuard } from './../../auth/guard/jwt-auth.guard';
import { AddressService } from './../service/address.service';
import { Address, civility } from './../entity/address.entity';
import verifyUUID from 'src/utils/uuid.verify';

@Controller('address')
export class AddressController {
    constructor(
        private readonly AddressService: AddressService,
    ) {}

    @Get()
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req : any):Promise<Address[]>{
        if(req.user.role != "Admin"){
            throw new UnauthorizedException();
        }
        return await this.AddressService.findAll()
    }

    @Get('my-address')
    @ApiTags('Adresse')
    @UseGuards(JwtAuthGuard)
    async myAddress(@Request() req: any):Promise<Address[]>{
        return await this.AddressService.findByUserID(req.user.id)
    }

    @Get('my-address/:id')
    @ApiTags('Adresse')
    @UseGuards(JwtAuthGuard)
    async findMyAddress(@Request() req: any, @Param('id') id: string):Promise<Address>{
        if(!verifyUUID(id) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        const address = await this.AddressService.findById(id)
        if (!address || address.userId != req.user.id || req.user.role != Role.Admin) {
            throw new NotFoundException('Address not found')
        }
        return address
    }


    @Post('new-address')
    @ApiTags('Adresse')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async create(@Request()req: any, @Body() body : CreateAddressDTO) : Promise<Address> {
        const newAddress = new Address()
        newAddress.userId = req.user.id
        newAddress.addressName = body.addressName.toLowerCase()
        newAddress.userName = body.userName.toLowerCase()
        newAddress.userFirstName = body.userFirstName.toLowerCase()
        newAddress.addressNumber = body.addressNumber.toLowerCase()
        newAddress.address = body.address.toLowerCase()
        newAddress.city = body.city.toLowerCase()
        newAddress.postalCode= body.postalCode
        newAddress.country= body.country.toLowerCase()
        newAddress.tel = body.tel
        newAddress.civility = body.civility.toLocaleLowerCase() =='ms' ? civility.Woman : civility.Men
        return await this.AddressService.createAddress(newAddress)
    }

    @Delete('remove-my-address')
    @ApiTags('Adresse')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async removemyadress(@Res() res,@Request() req : any, @Body() body: RemoveAddressDTO){
        //verify if it's UUID
        if(!verifyUUID(body.addressID) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        const address = await this.AddressService.findById(body.addressID)
        if(!address){
            throw new NotFoundException("Address doesn't exist")
        } else if( address.userId != req.user.id){
            throw new UnauthorizedException("You can't remove this Address")
        }else {
            await this.AddressService.removeAddress(address.id)
        }
        await res.redirect('my-address')
    }
}
