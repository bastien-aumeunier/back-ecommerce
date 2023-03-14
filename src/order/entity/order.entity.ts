import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    success= 'SUCCESS',
    failed= 'FAILED',
    pending= 'PENDING'
}

@Entity()
export class Order{
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column()
    userID: string;

    @Column()
    cartID: string;
    
    @Column()
    addressID: string;

    @Column()
    price: string;

    @CreateDateColumn({ name: 'created'})
    date: Date;

    @Column({ type: String, enum: Status, default: Status.pending })
    status: Status
}
