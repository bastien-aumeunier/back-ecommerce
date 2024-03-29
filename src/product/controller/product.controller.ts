import { CreateProductDTO, CreateReductionDTO, RemoveReductionDTO } from '../dto/product.dto';
import { Controller, Get, UseGuards, Request, Param, NotFoundException, Post, UsePipes, ValidationPipe, Body, Delete, HttpException, HttpStatus, ForbiddenException } from "@nestjs/common";
import { Product } from "../entity/product.entity";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { ProductService } from "../service/product.service";
import verifyUUID from 'src/utils/uuid.verify';
import { BrandService } from "src/brand/service/brand.service";
import { CategoryService } from "src/category/service/category.service";
import { SizeService } from "src/size/service/size.service";
import { ApiTags } from '@nestjs/swagger';
import { CategoryWithProducts } from 'src/category/model/category.model';

@Controller('products')
export class ProductController { 
    constructor(
        private readonly ProductService: ProductService,
        private readonly BrandService: BrandService,
        private readonly CategoryService: CategoryService,
        private readonly SizeService: SizeService,
    ) {}

    @Get()
    @ApiTags('Produits')
    async findAll(): Promise<Product[]> {
        return this.ProductService.findAll();
    }

    

    //get all product from brand
    @Get('brand/:id')
    @ApiTags('Marque')
    async findByBrand(@Param('id') id: string): Promise<Product[]> {
        if(!verifyUUID(id) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        const brand = await this.BrandService.findOneById(id);
        if (!brand) {
            throw new NotFoundException("Brand not found");
        }
        return await this.ProductService.findByBrand(brand.name);
    }

    //get all product from all categories
    @Get('categories')
    @ApiTags('Categories')
    async findAllCategoriesWithProduct(): Promise<CategoryWithProducts[]> {
        const categories = await this.CategoryService.findAll();
        const returnCategory = [];
        for(const categorie of categories) {
            const products = await this.ProductService.findByCategory(categorie.name);
            returnCategory.push(new CategoryWithProducts(categorie.id, categorie.name, products));
        }
        return returnCategory;
    }

    //get all product from a category
    @Get('category/:id')
    @ApiTags('Categories')
    async findByCategory(@Param('id') id: string): Promise<Product[]> {
        if(!verifyUUID(id) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        const category = await this.CategoryService.findOneById(id);
        if (!category) {
            throw new NotFoundException("Category not found");
        }
        return await this.ProductService.findByCategory(category.name);
    }

    //get a product by id
    @Get(':id')
    @ApiTags('Produits')
    async findOne(@Param('id') id: string): Promise<Product> {
        if(!verifyUUID(id) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        const product = await this.ProductService.findOneById(id);
        if (!product) {
            throw new NotFoundException();
        }
        return product;
    }


    @Post('new-product')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async create(@Request() req : any, @Body() body : CreateProductDTO) {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
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

    @Post('set-reduction')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async setReduction(@Request() req : any, @Body() body : CreateReductionDTO) {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        } else if(!verifyUUID(body.id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const product = await this.ProductService.findOneById(body.id);
        if (!product) {
            throw new NotFoundException();
        }
        return await this.ProductService.setReduction(body.id, body.reduction);
    }

    @Post('remove-reduction')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async removeReduction(@Request() req : any, @Body() body : RemoveReductionDTO) {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
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
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id, @Request() req :any): Promise<Product[]> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
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