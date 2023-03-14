import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum civility {
    Men = 'Mr',
    Woman = "Ms"
}

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId : string;

    @Column()
    addressName: string;

    @Column({ type: String, enum: civility, default: civility.Men })
    civility: civility

    @Column()
    userName: string;

    @Column()
    userFirstName: string;
    
    @Column()
    addressNumber: string;

    @Column()
    address:string;

    @Column()
    postalCode: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    tel: string;
}