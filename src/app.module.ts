//import { StripeModule } from './stripe/stripe.module';
//import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { BrandModule } from './brand/brand.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [],
        useUnifiedTopology: true,
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductModule,
    BrandModule,
    CategoryModule,
    CartModule,
    AddressModule,
    //OrderModule,
    //StripeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
