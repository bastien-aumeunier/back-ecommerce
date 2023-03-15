import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { FavorisController } from './controller/favoris.controller';
import { FavorisService } from './service/favoris.service';
import { Favoris } from './entity/favoris.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favoris]), forwardRef(()=> ProductModule)],
  controllers: [FavorisController],
  providers: [FavorisService],
  exports: []
})
export class FavorisModule {}
