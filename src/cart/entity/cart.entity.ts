import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    price: string;

    @Column()
    isPaid: boolean;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;
}