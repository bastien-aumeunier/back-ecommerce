import { CreateProductDTO } from '../dto/product.dto';
import { Product } from './../entity/product.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
    
 constructor(
    @InjectRepository(Product) private ProductRepository:  Repository<Product>,
 ){}


    async findAll(): Promise<Product[]> {
        return await this.ProductRepository.find()
    }

    async search(params: string): Promise<Product[]> {
        return await this.ProductRepository.find({where: { name: params }})
    }

    async findOneById(id: string): Promise<Product> {
        return await this.ProductRepository.findOne({where: { id: id }})
    }

    async findByBrand(brandName: string): Promise<Product[]> {
        return await this.ProductRepository.find({where: { brand: brandName }})
    }

    async findByCategory(categoryName: string): Promise<Product[]> {
        return await this.ProductRepository.find({where: { category: categoryName }})
    }

    async create(product: CreateProductDTO): Promise<Product> {
        const newProduct = this.ProductRepository.create(product)
        newProduct.brand = product.brand.toLowerCase()
        newProduct.category = product.category.toLowerCase()
        newProduct.reduction = 0
        return await this.ProductRepository.save(newProduct)
    }

    async setReduction(id: string, reduction: number): Promise<Product> {
        const product = await this.ProductRepository.findOne({where: { id: id }})
        product.reduction = reduction
        return await this.ProductRepository.save(product)
    }

    async removeReduction(id: string): Promise<Product> {
        const product = await this.ProductRepository.findOne({where: { id: id }})
        product.reduction = 0
        return await this.ProductRepository.save(product)
    }

    async deleteProduct(id: string) {
        await this.ProductRepository.delete(id)
    }
}
