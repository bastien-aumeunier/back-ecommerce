import { Entity, Column, PrimaryGeneratedColumn, } from 'typeorm';

export enum Role {
  Client = 'Client',
  Admin = 'Admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Client,
  })
  role : string;
  
  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

}
