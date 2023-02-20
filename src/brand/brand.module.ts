import { BrandController } from './contoller/brand.controller';
import { BrandService } from './service/brand.service';
import { Brand } from './entity/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Brand])],
    controllers: [BrandController],
    providers: [BrandService],
    exports: [BrandService],
})
export class BrandModule {}