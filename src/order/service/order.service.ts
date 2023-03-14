import { Repository } from 'typeorm';
import { Order, Status } from './../entity/order.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private OrderRepository: Repository<Order>
    ){}

    async findAll(): Promise<Order[]> {
        return await this.OrderRepository.find()
    }

    async findByID(id: string):Promise<Order>{
        return await this.OrderRepository.findOne({where: {id:id}})
    } 

    async findByUserID(userID: string): Promise<Order[]> {
        return await this.OrderRepository.find({where: {userID: userID}})
    }

    async create(order: Order): Promise<Order> {
        return await this.OrderRepository.save(this.OrderRepository.create(order))
    }

    async setStatus(orderID: string, status: Status){
        const order = await this.OrderRepository.findOne({where: {id: orderID}})
        order.status = status
        await this.OrderRepository.save(order)
    }
}
