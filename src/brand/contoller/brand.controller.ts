import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Request, ForbiddenException, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import verifyUUID from "src/utils/uuid.verify";
import { CreateBrandDTO } from "../dto/brand.dto";
import { Brand } from "../entity/brand.entity";
import { BrandService } from "../service/brand.service";

@Controller('brands')
export class BrandController {
    constructor(
        private readonly BrandService: BrandService,
    ) {}

    @Get()
    @ApiTags('Marque')
    @UseGuards(JwtAuthGuard)
    async findAll(): Promise<Brand[]> {
        return this.BrandService.findAll();
    }

    @Get(':id')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findOneById(@Param('id') id: string, @Request() req : any): Promise<Brand> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        } else if(!verifyUUID(id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const brand = await this.BrandService.findOneById(id);
        if (!brand) {
            throw new NotFoundException();
        }
        return brand;
    }

    @Post('new-brand')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async create(@Request() req : any, @Body() body : CreateBrandDTO) {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        }
        const brand = await this.BrandService.findOneByName(body.name);
        if (brand) {
            throw new HttpException("Brand already exists", HttpStatus.FORBIDDEN);
        }
        return await this.BrandService.create(body);
    }

    @Delete(':id')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async deleteBrand(@Param('id') id: string, @Request() req :any): Promise<Brand[]> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        }else if(!verifyUUID(id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const brand = await this.BrandService.findOneById(id);
        if (!brand) {
            throw new NotFoundException();
        }
        await this.BrandService.deleteBrand(id);
        return this.BrandService.findAll();
    }
}