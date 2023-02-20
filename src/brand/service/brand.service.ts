import { CreateBrandDTO } from './../dto/brand.dto';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Brand } from "../entity/brand.entity";

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand) private BrandRepository: Repository<Brand>,
    ) {}

    async findAll(): Promise<Brand[]> {
        return await this.BrandRepository.find();
    }

    async findOneById(id: string): Promise<Brand> {
        return await this.BrandRepository.findOne({ where: { id: id } });
    }

    async findOneByName(name: string): Promise<Brand> {
        name = name.toLowerCase();
        return await this.BrandRepository.findOne({ where: { name: name } });
    }

    async create(brand: CreateBrandDTO): Promise<Brand> {
        const newBrand = this.BrandRepository.create(brand);
        newBrand.name = brand.name.toLowerCase();
        return await this.BrandRepository.save(newBrand);
    }

    async deleteBrand(id: string){
        await this.BrandRepository.delete(id);
    }
}