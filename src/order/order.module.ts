import { UserModule } from './../user/user.module';
import { StripeModule } from './../stripe/stripe.module';
import { CartModule } from './../cart/cart.module';
import { AddressModule } from './../address/address.module';
import { ProductModule } from './../product/product.module';
import { Order } from './entity/order.entity';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order]),  forwardRef(()=> ProductModule), forwardRef(()=> AddressModule), forwardRef(()=> CartModule), forwardRef(()=>StripeModule), forwardRef(()=> UserModule)],
  controllers: [OrderController],
  providers: [OrderService],
  exports: []
})
export class OrderModule {}
