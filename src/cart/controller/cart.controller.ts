import { Body, UseGuards, Controller, Get, Request, Post, NotFoundException, ValidationPipe, UsePipes, Res, Delete, ForbiddenException  } from '@nestjs/common';
import { ReturnCart, ProductonCart } from './../model/cart.model';
import { CartProduct } from './../entity/cartProducts.entity';
import { ProductService } from './../../product/service/product.service';
import { ATCDTO, ConvertCartDTO } from './../dto/cart.dto';
import { CartService } from './../service/cart.service';
import { JwtAuthGuard } from './../../auth/guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Cart } from '../entity/cart.entity';
import verifyUUID from 'src/utils/uuid.verify';

@Controller("carts")
export class CartController {
    constructor(
        private readonly CartService: CartService,
        private readonly ProductService: ProductService,
    ){}

    @Get()
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req : any):Promise<ReturnCart[]> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        }
        const allCarts = []
        const allCart = await this.CartService.findAll();
        for (const cart of allCart) {
            let products = []
            const cartProd = await this.CartService.findCartProductByCartID(cart.id)
            let price = 0
            for(const element of cartProd){
                const test = await this.ProductService.findOneById(element.productId)
                products.push(new ProductonCart(test.id, test.name, test.image, test.price, test.brand, test.description, test.reduction, test.category, test.size, element.quantity))
                const percent = (parseFloat(test.price)*element.quantity)*test.reduction/100
                price += (parseFloat(test.price)*element.quantity)-percent
            }
            allCarts.push(new ReturnCart(cart.id, cart.userId, price.toFixed(2).toString(), cart.isPaid, cart.createdAt, products))
        }
        return allCarts
    }

    @Get('my-cart')
    @ApiTags('Panier')
    @UseGuards(JwtAuthGuard)
    async myCart(@Request() req:any):Promise<ReturnCart>{
        let cart = await this.CartService.findCurrentCartByUserId(req.user.id)
        if (!cart) {
            //Create Cart
            const newCart = new Cart()
            newCart.isPaid = false
            newCart.price= "0"
            newCart.userId= req.user.id
            cart = await this.CartService.createCart(newCart)
        }
            //Get cart and all product on
            const products = []
            const cartProd = await this.CartService.findCartProductByCartID(cart.id)
            let price = 0
            for (const element of cartProd) {
                const test = await this.ProductService.findOneById(element.productId)
                products.push(new ProductonCart(test.id, test.name, test.image, test.price, test.brand, test.description, test.reduction, test.category, test.size, element.quantity))
                const percent = (parseFloat(test.price)*element.quantity)*test.reduction/100
                price += (parseFloat(test.price)*element.quantity)-percent
            }
            await this.CartService.setCartPrice(cart.id, price.toFixed(2).toString()) //a tester
         return new ReturnCart(cart.id, cart.userId, price.toFixed(2).toString(), cart.isPaid, cart.createdAt, products)
    }

    @Post('add-to-cart')
    @ApiTags('Panier')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async addCart(@Body() body: ATCDTO, @Request() req, @Res() res ) {
        //verify if it's UUID
        if(!verifyUUID(body.productId) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        const product = await this.ProductService.findOneById(body.productId)
        if(!product){
            throw new NotFoundException("Product not Found")
        } else if(product.stock == 0) {
            throw new ForbiddenException("Product don't have stock")
        } else {
            let cart = await this.CartService.findCurrentCartByUserId(req.user.id)
            if(!cart){
                //Create Cart
                const newCart = new Cart()
                newCart.isPaid = false
                newCart.price= "0"
                newCart.userId= req.user.id
                cart = await this.CartService.createCart(newCart)
            }
                //look if the same product is on the cart
            const CartProd = await this.CartService.findCartProductByCartIDProductID(cart.id, body.productId)
            if(CartProd){
                //add 1 to quantity
                await this.CartService.addQuantitytoProductCart(cart.id, body.productId)
            } else {
                //add product to cart
                const cartProduct = new CartProduct()
                cartProduct.cartId = cart.id
                cartProduct.productId= body.productId
                cartProduct.quantity= 1
                await this.CartService.createProductCart(cartProduct)
            }
            await res.redirect('my-cart')
        }
    }

    @Delete('remove-to-cart')
    @ApiTags('Panier')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async removeproduct(@Body() body: ATCDTO, @Request() req, @Res() res) {   
        //verify if it's UUID
        if(!verifyUUID(body.productId) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        const product = await this.ProductService.findOneById(body.productId)
        if(!product){
            throw new NotFoundException("Product not Found")
        }
        let cart = await this.CartService.findCurrentCartByUserId(req.user.id)
        if(!cart){
            throw new NotFoundException("Cart Not Found")
        }
        //look if the product is on the cart
        const CartProd = await this.CartService.findCartProductByCartIDProductID(cart.id, body.productId)
        if(CartProd){
            if( CartProd.quantity <= 1){
                await this.CartService.removeProductCart(cart.id, body.productId)
            } else {
                await this.CartService.removeQuantitytoProductCart(cart.id, body.productId)
            }
        } else {
            throw new NotFoundException("Product not in cart")
        }
        await res.redirect('my-cart')

    }

    @Post('convert-to-cart')
    @ApiTags('Panier')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async syncCart(@Body() body: ConvertCartDTO, @Request() req,@Res() res){
        let cart = await this.CartService.findCurrentCartByUserId(req.user.id)
        if(!cart){
            //Create Cart
            const newCart = new Cart()
            newCart.isPaid = false
            newCart.price= "0"
            newCart.userId= req.user.id
            await this.CartService.createCart(newCart)
        }
        cart = await this.CartService.findCurrentCartByUserId(req.user.id)
        //for each product of converted Cart 

        for(const productID of body.products){
            //verify if it's UUID
            if(!verifyUUID(productID) ) {
                throw new ForbiddenException('Invalid UUID')
            }
            //look stock
            const prod = await this.ProductService.findOneById(productID)
            if(!prod){
                throw new NotFoundException(`Product ${productID} not Found`)
            } else if(prod.stock == 0) {
                throw new ForbiddenException(`Product ${productID} don't have stock`)
            } else {
                const CartProd = await this.CartService.findCartProductByCartIDProductID(cart.id, productID)
                if(CartProd){
                    //add 1 to quantity
                    await this.CartService.addQuantitytoProductCart(cart.id, productID)
                } else {
                    //add product to cart
                    const cartProduct = new CartProduct()
                    cartProduct.cartId = cart.id
                    cartProduct.productId= productID
                    cartProduct.quantity= 1
                    await this.CartService.createProductCart(cartProduct)
                }
            }

        }
        await res.redirect('my-cart')
    }

}
