import { CreateCategoryDTO } from './../dto/category.dto';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from '../entity/category.entity';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private CategoryRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        return await this.CategoryRepository.find();
    }

    async findOneById(id: string): Promise<Category> {
        return await this.CategoryRepository.findOne({ where: { id: id } });
    }

    async findOneByName(name: string): Promise<Category> {
        name = name.toLowerCase();
        return await this.CategoryRepository.findOne({ where: { name: name } });
    }

    async create(category: CreateCategoryDTO): Promise<Category> {
        const newcategory = this.CategoryRepository.create(category);
        newcategory.name = category.name.toLowerCase();
        return await this.CategoryRepository.save(newcategory);
    }

    async deleteCategory(id: string){
        await this.CategoryRepository.delete(id);
    }
}