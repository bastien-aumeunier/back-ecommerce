import { Product } from './../../product/entity/product.entity';
export class CartProd {
    constructor(
        public cartId: string,
        public productId: string,
        public quantity: number
    ){}
}

export class ReturnCart{
    constructor(
        public id: string,
        public userId: string,
        public price: string,
        public isPaid: boolean,
        public createdAt: Date,
        public products: Product[]
    ){}
}


export class ProductonCart{
    constructor(
        public id: string,
        public name: string,
        public image: string,
        public price: string,
        public brand: string,
        public description: string,
        public reduction: number,
        public category: string,    
        public size: string,    
        public quantity: number
    ){}
}