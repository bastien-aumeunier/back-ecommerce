import { Favoris } from './../entity/favoris.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class FavorisService {
    constructor(
        @InjectRepository(Favoris) private FavorisRepository: Repository<Favoris>
    ){}

    async findAll(): Promise<Favoris[]>{
        return await this.FavorisRepository.find()
    }

    async findByUserID(id: string): Promise<Favoris[]>{
        return await this.FavorisRepository.find({where: {userID:id}})
    }

    async findByID(id:string): Promise<Favoris>{
        return await this.FavorisRepository.findOne({where: {id:id}})
    }

    async findByUserProduct(userID: string, productID: string): Promise<Favoris>{
        return await this.FavorisRepository.findOne({where: {userID: userID, productID: productID}})
    }

    async create(favoris: Favoris): Promise<Favoris>{
        return await this.FavorisRepository.save(this.FavorisRepository.create(favoris))
    }

    async remove(userID: string, productID: string){
        const fav:Favoris = await this.findByUserProduct(userID, productID)
        await this.FavorisRepository.delete(fav.id)
    }

}
