import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Size {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    category: string;

    @Column()
    size: string;
    
}