import { CartProduct } from './entity/cartProducts.entity';
import { Cart } from './entity/cart.entity';
import { CartService } from './service/cart.service';
import { CartController } from './controller/cart.controller';
import { forwardRef, Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]),TypeOrmModule.forFeature([CartProduct]),forwardRef(()=> ProductModule)],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
