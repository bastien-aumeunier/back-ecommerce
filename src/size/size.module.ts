import { CategoryModule } from './../category/category.module';
import { SizeService } from './service/size.service';
import { SizeController } from './controller/size.controller';
import { Size } from './entity/size.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([Size]), forwardRef(()=> CategoryModule)],
    controllers: [SizeController],
    providers: [SizeService],
    exports: [SizeService],
})
export class SizeModule {}