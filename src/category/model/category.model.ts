import { Product } from "src/product/entity/product.entity";


export class CategoryWithProducts {
    constructor(

        public id: string,
        public name: string,
        public products: Product[]
    ) {}
}