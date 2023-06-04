import { Role } from 'src/user/entity/user.entity';
import { Controller, Get, Request, UseGuards, Body, Post, UsePipes, ValidationPipe, Res, Delete, NotFoundException, Param, ForbiddenException, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAddressDTO } from './../dto/address.dto';
import { JwtAuthGuard } from './../../auth/guard/jwt-auth.guard';
import { AddressService } from './../service/address.service';
import { Address, civility } from './../entity/address.entity';
import verifyTel from 'src/utils/tel.verify';

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
            throw new ForbiddenException();
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
    async findMyAddress(@Request() req: any, @Param('id', new ParseUUIDPipe()) id: string):Promise<Address>{
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
        const address: Address = await this.AddressService.findByUserName(req.user.id, body.addressName)
        if (address) {
            throw new ForbiddenException(`You have already address with name : ${body.addressName}`)
        }
        if(!verifyTel(body.tel)){
            throw new ForbiddenException('Invalid Tel Number')
        }
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

    @Delete('remove-address/:id')
    @ApiTags('Adresse')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async removemyadress(@Res() res,@Request() req : any, @Param('id', new ParseUUIDPipe()) id: string){
        const address = await this.AddressService.findById(id)
        if(!address){
            throw new NotFoundException("Address doesn't exist")
        } else if( address.userId != req.user.id){
            throw new ForbiddenException("You can't remove this Address")
        }else {
            await this.AddressService.removeAddress(address.id)
        }
        await res.redirect('my-address')
    }
}
