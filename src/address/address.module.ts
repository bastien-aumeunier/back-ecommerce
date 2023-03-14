import { AddressController } from './controller/address.controller';
import { AddressService } from './service/address.service';
import { Address } from './entity/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
