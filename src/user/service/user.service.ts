import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, User } from "../entity/user.entity";
import { CreateUserDTO } from "../dto/user.dto";
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private UserRepository:  Repository<User>,
  ) {}

    async findAll(): Promise<User[]> {
        return await this.UserRepository.find();
        //ne pas renvoyer les pwd
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.UserRepository.findOne({where: { email: email }});
    }

    async findOneById(id: string): Promise<User> {
        const user = await this.UserRepository.findOne({where: { id: id }})
        user.password = ""
        return user;
        
    }

    async updateRole(user: User, role: string): Promise<User> {
        if (!user) {
            return null;
        }
        if (role == Role.Admin) {
            user.role = Role.Admin;
        } else{
            user.role = Role.Client;
        }
        return await this.UserRepository.save(user);
    }   

    async create(user2: CreateUserDTO): Promise<User> {
        const user = this.UserRepository.create(user2);
        user.password = await bcrypt.hash(user.password, 10)
        user.role = Role.Client
        await this.UserRepository.save(user)
        user.password = ""
        return user;
    }
}