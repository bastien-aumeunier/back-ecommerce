import { Category } from './../entity/category.entity';
import { CategoryService } from './../service/category.service';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Request, ForbiddenException, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { CreateCategoryDTO } from '../dto/category.dto';
import verifyUUID from 'src/utils/uuid.verify';
import { ApiTags } from '@nestjs/swagger';

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly CategoryService: CategoryService,
    ) {}

    @Get()
    @ApiTags('Categories')
    async findAll(): Promise<Category[]> {
        return this.CategoryService.findAll();
    }

    @Get(':id')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findOneById(@Param('id') id: string, @Request() req : any): Promise<Category> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        } else if(!verifyUUID(id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const category = await this.CategoryService.findOneById(id);
        if (!category) {
            throw new NotFoundException();
        }
        return category;
    }

    @Post('new-category')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async create(@Request() req : any, @Body() body : CreateCategoryDTO) {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        }
        const category = await this.CategoryService.findOneByName(body.name);
        if (category) {
            throw new HttpException("Category already exists", HttpStatus.FORBIDDEN);
        }
        return await this.CategoryService.create(body);
    }

    @Delete(':id')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async deleteCategory(@Param('id') id: string, @Request() req :any): Promise<Category[]> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        } else if(!verifyUUID(id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const category = await this.CategoryService.findOneById(id);
        if (!category) {
            throw new NotFoundException();
        }
        await this.CategoryService.deleteCategory(id);
        return this.CategoryService.findAll();
    }
}