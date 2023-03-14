import { Status } from './../entity/order.entity';
export class ReturnOrder {
    constructor(

        public id: string,
        public userID: string,
        public cartID: string,
        public addressID: string,
        public status: Status,
        public price: string,
        public date: Date,
        public product: ProductOrder[]
    ) {}
}

export class ProductOrder{
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