import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productId: string

    @Column()
    cartId: string

    @Column()
    quantity: number
}