import { Controller, Get, UseGuards, Request, ValidationPipe, Body, UsePipes, Post, Res, ForbiddenException, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import verifyUUID from 'src/utils/uuid.verify';
import { AddFavorisDTO } from './../dto/favoris.dto';
import { ProductService } from './../../product/service/product.service';
import { FavorisService } from './../service/favoris.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Favoris } from '../entity/favoris.entity';
import { ProductFavoris } from '../model/favoris.model';

@Controller('favoris')
export class FavorisController {
    constructor(
        private readonly FavorisService: FavorisService,
        private readonly ProductService: ProductService
    ){}

    @Get()
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req : any): Promise<Favoris[]> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        }
        return await this.FavorisService.findAll();
    }

    @Get('my-favoris')
    @ApiTags('Favoris')
    @UseGuards(JwtAuthGuard)
    async findMyFavoris(@Request() req:any): Promise<ProductFavoris[]> {
        const allFav: Favoris[] = await this.FavorisService.findByUserID(req.user.id)
        const list:ProductFavoris[] = []
        for(const element of allFav){
            const product = await this.ProductService.findOneById(element.productID)
            list.push(new ProductFavoris(product.id, product.name, product.image, product.price, product.brand, product.description, product.reduction, product.category, product.size))
        }
        return list
    }

    @Get('user-favoris/:id')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findFavorisByUser(@Request() req: any, @Param('id') id : string): Promise<ProductFavoris[]> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        } else if(!verifyUUID(id)) {
            throw new ForbiddenException('Invalid UUID')
        }
        const allFav: Favoris[] = await this.FavorisService.findByUserID(id)
        const list:ProductFavoris[] = []
        for(const element of allFav){
            const product = await this.ProductService.findOneById(element.productID)
            list.push(new ProductFavoris(product.id, product.name, product.image, product.price, product.brand, product.description, product.reduction, product.category, product.size))
        }
        return list
    }

    @Post('new-favoris')
    @ApiTags('Favoris')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async create(@Request() req: any, @Body() body: AddFavorisDTO, @Res()res :any): Promise<void> { 
        if(!isUUID(body.productID)){
            throw new ForbiddenException('Invalid UUID')
        }
        const fav:Favoris = await this.FavorisService.findByUserProduct(req.user.id, body.productID)
        if(fav){
            throw new ForbiddenException('Product already in favoris')
        }
        const newFavoris = new Favoris()
        newFavoris.productID = body.productID
        newFavoris.userID = req.user.id
        await this.FavorisService.create(newFavoris)
        res.redirect('my-favoris')
    }

    @Delete('remove-favoris')
    @ApiTags('Favoris')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async remove(@Request() req: any, @Body() body: AddFavorisDTO, @Res()res :any): Promise<void>{
        if(!isUUID(body.productID)){
            throw new ForbiddenException('Invalid UUID')
        }
        const fav:Favoris = await this.FavorisService.findByUserProduct(req.user.id, body.productID)
        if(!fav){
            throw new ForbiddenException('This product is not in favoris')
        }
        await this.FavorisService.remove(req.user.id, body.productID)
        res.redirect('my-favoris')
    }


}
