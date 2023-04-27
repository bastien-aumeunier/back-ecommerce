export class ProductQuantity {
    constructor(
        public productID: string,
        public productName: string,
        public productQuantity: number,
    ){}
}
export class ReturnStripe {
    constructor(
        public clientSecret: string,
    ){}
}