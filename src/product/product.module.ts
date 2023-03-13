import { CategoryModule } from './../category/category.module';
import { BrandModule } from './../brand/brand.module';
import { ProductController } from './controller/product.controller';
import { Product } from './entity/product.entity';
import { ProductService } from './service/product.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeModule } from 'src/size/size.module';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), forwardRef(()=> BrandModule), forwardRef(()=> CategoryModule), forwardRef(()=> SizeModule)],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}