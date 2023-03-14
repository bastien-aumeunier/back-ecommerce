import { StripeService } from './../../stripe/service/stripe.service';
import { ProductQuantity } from './../../stripe/model/stripe.model';
import { CreateOrderDTO } from './../dto/order.dto';
import { ProductService } from './../../product/service/product.service';
import { Role } from './../../user/entity/user.entity';
import { Controller, Get, UnauthorizedException, UseGuards, Request, Param, UsePipes, ValidationPipe, Body, Post, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartService } from './../../cart/service/cart.service';
import { AddressService } from './../../address/service/address.service';
import { OrderService } from './../service/order.service';
import { Order, Status } from '../entity/order.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ProductOrder, ReturnOrder } from '../model/order.model';
import verifyUUID from 'src/utils/uuid.verify';

@Controller('orders')
export class OrderController {
    constructor(
        private readonly OrderService: OrderService,
        private readonly AddressService: AddressService,
        private readonly CartService: CartService,
        private readonly ProductService: ProductService,
        private readonly StripeService: StripeService
    ){}

    @Get()
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req : any): Promise<Order[]> {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        }
        return await this.OrderService.findAll();
    }

    @Get('my-orders')
    @ApiTags('Commandes')
    @UseGuards(JwtAuthGuard)
    async findMyOrder(@Request() req: any):  Promise<Order[]> {
        return await this.OrderService.findByUserID(req.user.id)
    }

    @Get('my-orders/:id')
    @ApiTags('Commandes')
    @UseGuards(JwtAuthGuard)
    async findOrderByID(@Request() req: any, @Param('id') id : string) : Promise<ReturnOrder> {
        //verify if it's UUID
        if(!verifyUUID(id) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        const order = await this.OrderService.findByID(id)
        const products = []
        const cartProd = await this.CartService.findCartProductByCartID(order.cartID)
        //get all products from productCart
        for (const element of cartProd) {
            const test = await this.ProductService.findOneById(element.productId)
            products.push(new ProductOrder(test.id, test.name, test.image, test.price, test.brand, test.description, test.reduction, test.category, test.size, element.quantity))
        }
        if (req.user.role == Role.Admin || order.userID == req.user.id) {
            return new ReturnOrder(order.id, order.userID, order.cartID, order.addressID, order.status, order.price, order.date, products)
        }
        throw new UnauthorizedException()
    }


    @Post('start-checkout')
    @ApiTags('Commandes')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async create(@Request() req: any, @Body() body: CreateOrderDTO){
        //verify if it's UUID
        if(!verifyUUID(body.addressID) ||!verifyUUID(body.cartID) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        //verify if all info is good
        const address = await this.AddressService.findById(body.addressID)
        if (!address || address.userId != req.user.id) {
            throw new UnauthorizedException("Can't use this address")
        }
        const cart = await this.CartService.findCartByCartID(body.cartID)
        if (!cart || cart.userId != req.user.id || cart.isPaid) {
            throw new UnauthorizedException("Can't use this cart")
        }
        const cartProd = await this.CartService.findCartProductByCartID(cart.id)
        const listProduct = []
        let price = 0
        //get the last price and verify quantity
        for (const element of cartProd) {
            const produit = await this.ProductService.findOneById(element.productId)
            listProduct.push(new ProductQuantity(produit.id, produit.name, element.quantity))
            const percent = (parseFloat(produit.price)*element.quantity)*produit.reduction/100
            price += (parseFloat(produit.price)*element.quantity)-percent
            if(produit.stock- element.quantity < 0){
                throw new NotFoundException('Product out of stock verify quantity')
            }
        }
        await this.CartService.setCartPrice(cart.id, price.toFixed(2).toString())
        //create new order with status pending
        const newOrder = new Order()
        newOrder.addressID= body.addressID
        newOrder.userID= req.user.id
        newOrder.cartID= body.cartID
        newOrder.price= price.toFixed(2).toString()
        newOrder.status= Status.pending
        const order = await this.OrderService.create(newOrder)
        //create stripe paiement
        return await this.StripeService.createPayment(price.toFixed(2).toString(), req.user.id, body.addressID, listProduct, order.id)
    }


    @Post('finish-checkout')
    @ApiTags('Admin')
    async webhook(@Request() req: any, @Body() body : any){
        //get the response from stripe paiement
        const sig:string = req.headers['stripe-signature']
        const event = await this.StripeService.listenWebhook(body, sig)
        if(event.type === 'payment_intent.succeeded' ) {
            //if payment is successful we remove product from stock and set order and cart paid
            const orderID = event.data.object.metadata.orderID
            const order = await this.OrderService.findByID(orderID)
            const cartProd = await this.CartService.findCartProductByCartID(order.cartID)
            for (const element of cartProd) {
                const produit = await this.ProductService.findOneById(element.productId)
                if(produit.stock- element.quantity < 0){
                    throw new NotFoundException('Product out of stock verify quantity')
                } else {
                    await this.ProductService.removeStock(produit.id, element.quantity)
                }
            }
            await this.OrderService.setStatus(orderID, Status.success)
            await this.CartService.setPaid(order.cartID)
        } else if(event.type === 'payment_intent.payment_failed' ){
            //else we set paiement failed
            const orderID = event.data.object.metadata.orderID
            await this.OrderService.setStatus(orderID, Status.failed)
        }
    }
}
