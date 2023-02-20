import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column()
    price: string;

    @Column()
    brand: string;

    @Column()
    description: string;

    @Column()
    stock: number;

    @Column()
    reduction: number;

    @Column()
    category: string;
    
    @Column()
    size: string;
}