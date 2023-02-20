import { CreateProductDTO, CreateReductionDTO, RemoveReductionDTO } from '../dto/product.dto';
import { Controller, Get, UnauthorizedException, UseGuards, Request, Param, NotFoundException, Post, UsePipes, ValidationPipe, Body, Delete, HttpException, HttpStatus } from "@nestjs/common";
import { Product } from "../entity/product.entity";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { ProductService } from "../service/product.service";
import verifyUUID from 'src/utils/uuid.verify';
import { BrandService } from "src/brand/service/brand.service";
import { CategoryService } from "src/category/service/category.service";
import { SizeService } from "src/size/service/size.service";

@Controller('products')
export class ProductController { 
    constructor(
        private readonly ProductService: ProductService,
        private readonly BrandService: BrandService,
        private readonly CategoryService: CategoryService,
        private readonly SizeService: SizeService,
    ) {}

    @Get()
    async findAll(): Promise<Product[]> {
        return this.ProductService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Product> {
        if(!verifyUUID(id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const product = await this.ProductService.findOneById(id);
        if (!product) {
            throw new NotFoundException();
        }
        return product;
    }
    //faire en sorte que sur la page produit on puisse changer de size

    //faire une route multi query params
    /*
    @Get('brand/:name')
    async findByBrand(@Param('name') name: string): Promise<Product[]> {
        const brand = await this.BrandService.findOneByName(name);
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }
        return await this.ProductService.findByBrand(brand.name);
    }

    @Get('category/:name')
    async findByCategory(@Param('name') name: string): Promise<Product[]> {
        const category = await this.CategoryService.findOneByName(name);
        if (!category) {
            throw new NotFoundException("Category not found");
        }
        return await this.ProductService.findByCategory(category.name);
    }
    */
    @Post('newproduct')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async create(@Request() req : any, @Body() body : CreateProductDTO) {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        }
        const brand = await this.BrandService.findOneByName(body.brand);
        const category = await this.CategoryService.findOneByName(body.category);
        const size = await this.SizeService.findOneByTypeAndValue(body.category, body.size);
        if (!brand) {
            throw new NotFoundException("Brand not found");
        } else if (!category) {
            throw new NotFoundException("Category not found");
        } else if (!size) {
            throw new NotFoundException("Size not found");
        }
        return await this.ProductService.create(body);
    }

    @Post('setreduction')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async setReduction(@Request() req : any, @Body() body : CreateReductionDTO) {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        } else if(!verifyUUID(body.id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const product = await this.ProductService.findOneById(body.id);
        if (!product) {
            throw new NotFoundException();
        }
        return await this.ProductService.setReduction(body.id, body.reduction);
    }

    @Post('removereduction')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async removeReduction(@Request() req : any, @Body() body : RemoveReductionDTO) {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        } else if(!verifyUUID(body.id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const product = await this.ProductService.findOneById(body.id);
        if (!product) {
            throw new NotFoundException();
        }
        return await this.ProductService.removeReduction(body.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id, @Request() req :any): Promise<Product[]> {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        } else if(!verifyUUID(id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const product = await this.ProductService.findOneById(id);
        if (!product) {
            throw new NotFoundException();
        }
        await this.ProductService.deleteProduct(id);
        return this.ProductService.findAll();
    }
}