import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Favoris{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userID: string;

    @Column()
    productID: string;
}