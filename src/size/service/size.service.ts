import { CreateSizeDTO } from './../dto/size.dto';
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Size } from "../entity/size.entity";

@Injectable()
export class SizeService {
    constructor(
        @InjectRepository(Size) private SizeRepository: Repository<Size>,
    ) {}

    async findAll(): Promise<Size[]> {
        return await this.SizeRepository.find();
    }

    async findByCategory(category: string): Promise<Size[]> {
        category = category.toLowerCase();
        return await this.SizeRepository.find({ where: { category: category } });
    }

    async findOneById(id: string): Promise<Size> {
        return await this.SizeRepository.findOne({ where: { id: id } });
    }
    async findOneByTypeAndValue(category: string, size: string): Promise<Size> {
        category = category.toLowerCase();
        size = size.toUpperCase();
        return await this.SizeRepository.findOne({ where: { category: category, size: size } });
    }

    async create(body: CreateSizeDTO): Promise<Size> {
        const newSize = this.SizeRepository.create(body);
        newSize.category = body.category.toLowerCase();
        newSize.size = body.size.toUpperCase();
        return await this.SizeRepository.save(newSize);
    }

    async deleteSize(id: string){
        await this.SizeRepository.delete(id);
    }
}