import { Controller, Request, UseGuards, Get, Param, UnauthorizedException, HttpException, HttpStatus, NotFoundException, Body, ValidationPipe, UsePipes, Post, Delete } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import verifyUUID from "src/utils/uuid.verify";
import { CreateSizeDTO } from "../dto/size.dto";
import { Size } from "../entity/size.entity";
import { SizeService } from "../service/size.service";
import { CategoryService } from "src/category/service/category.service";

@Controller('size')
export class SizeController {
    constructor(
        private readonly SizeService: SizeService,
        private readonly CategoryService: CategoryService,
    ) {}

    @Get()
    async findAll(): Promise<Size[]> {
        return this.SizeService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOneById(@Param('id') id: string, @Request() req: any): Promise<Size> {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        } else if (!verifyUUID(id)) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const size = await this.SizeService.findOneById(id);
        if (!size) {
            throw new NotFoundException();
        }
        return size;
    }

    @Post('newsize')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async create(@Request() req: any, @Body() body: CreateSizeDTO) {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        }
        const size = await this.SizeService.findOneByTypeAndValue(body.category, body.size);
        if (size) {
            throw new HttpException("Size already exists", HttpStatus.FORBIDDEN);
        }
        const category = await this.CategoryService.findOneByName(body.category);
        if (!category) {
            throw new NotFoundException("Category not found");
        }
        return await this.SizeService.create(body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteSize(@Param('id') id: string, @Request() req: any): Promise<Size[]> {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        } else if (!verifyUUID(id)) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const size = await this.SizeService.findOneById(id);
        if (!size) {
            throw new NotFoundException();
        }
        await this.SizeService.deleteSize(id);
        return this.SizeService.findAll();
    }
    
}