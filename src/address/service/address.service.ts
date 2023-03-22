import { Repository } from 'typeorm';
import { Address } from './../entity/address.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address) private AddressRepository: Repository<Address>
    ) {}

    async findAll(): Promise<Address[]> {
        return await this.AddressRepository.find()
    }

    async findByUserID(id: string): Promise<Address[]> {
        return await this.AddressRepository.find({where: {userId: id}})
    }

    async findByUserName(userID: string, name:string): Promise<Address> {
        return await this.AddressRepository.findOne({where : {userId: userID, addressName: name}})
    }

    async findById(id: string): Promise<Address>{
        return await this.AddressRepository.findOne({where: {id: id}})
    }

    async createAddress(address: Address):Promise<Address>{
        return await this.AddressRepository.save(this.AddressRepository.create(address))
    }

    async removeAddress(id : string){
        await this.AddressRepository.delete(id)
    }
}
    

