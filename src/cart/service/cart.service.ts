import { Product } from './../../product/entity/product.entity';
import { Repository } from 'typeorm';
import { Cart } from './../entity/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { Injectable } from '@nestjs/common';
import { CartProduct } from '../entity/cartProducts.entity';
import { CartProd } from '../model/cart.model';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private CartRepository: Repository<Cart>,
        @InjectRepository(CartProduct) private CartProductRepository: Repository<CartProduct>
    ) {}

    async findAll() : Promise<Cart[]>{
        return await this.CartRepository.find()
    }

    async findCartByCartID(id: string) : Promise<Cart>{
        return await this.CartRepository.findOne({where: {id: id}})
    }

    async findCurrentCartByUserId(id: string): Promise<Cart>{
        return await this.CartRepository.findOne({where: [{userId: id}, {isPaid: false}]})
    }
    async findAllCartByUserId(id: string): Promise<Cart[]>{
        return await this.CartRepository.find({where: [{userId: id}, {isPaid: false}]})
    }
    
    async createCart(body: Cart): Promise<Cart> {
        return await this.CartRepository.save(this.CartRepository.create(body))
    }

    async setPaid(cartID: string){
        const cart = await this.CartRepository.findOne({where: {id:cartID}})
        cart.isPaid = true
        return await this.CartRepository.save(cart)
    }
    
    async setCartPrice(cartId:string, price: string){
        const cart = await this.CartRepository.findOne({where:{id: cartId}})
        cart.price = price
        await this.CartRepository.save(cart)
    }
    
    async findCartProductByCartID(id: string) : Promise<CartProduct[]>{
        return await this.CartProductRepository.find({where:{cartId: id}})
    }
    async findCartProductByCartIDProductID(cartId: string, productId: string): Promise<CartProduct>{
            return await this.CartProductRepository.findOne({where: [{cartId: cartId}, {productId: productId}]})
    }

    async createProductCart(body: CartProd): Promise<CartProduct>{
        return await this.CartProductRepository.save(this.CartProductRepository.create(body))
    }

    async addQuantitytoProductCart(cartId: string, productId: string): Promise<CartProduct>{
        const cartProd =  await this.CartProductRepository.findOne({where: [{cartId: cartId}, {productId: productId}]})
        cartProd.quantity ++
        return await this.CartProductRepository.save(cartProd)
    }

    async removeQuantitytoProductCart(cartId: string, productId: string): Promise<CartProduct>{
        const cartProd =  await this.CartProductRepository.findOne({where: [{cartId: cartId}, {productId: productId}]})
        cartProd.quantity --
        return await this.CartProductRepository.save(cartProd)
    }
    async removeProductCart(cartId:string, productId:string){
        const cartProd = await this.CartProductRepository.findOne({where: [{cartId: cartId}, {productId: productId}]})
        await this.CartProductRepository.delete(cartProd.id)
    }


}
