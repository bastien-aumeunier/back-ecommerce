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
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.UserRepository.findOne({where: { email: email }});
    }

    async findOneById(id: string): Promise<User> {
        return await this.UserRepository.findOne({where: { id: id }});
    }

    async updateRole(userID: string, role: string): Promise<User> {
        const user = await this.UserRepository.findOne({where: { id: userID }});
        user.role = role ==  Role.Admin ? Role.Client : Role.Admin;
        return await this.UserRepository.save(user);
    }   

    async create(body: CreateUserDTO): Promise<User> {
        const user = this.UserRepository.create(body);
        user.password = await bcrypt.hash(user.password, 10);
        user.role = Role.Client;
        return await this.UserRepository.save(user);
    }

    async changePWD(userID: string, newPassWord: string): Promise<User> {
        const user = await this.UserRepository.findOne({where: { id: userID }});
        user.password = await bcrypt.hash(newPassWord, 10);
        return await this.UserRepository.save(user);
    }
    async changeProfil(userID: string, newString:string, type: string): Promise<User> {
        const user = await this.UserRepository.findOne({where: { id: userID }});
        switch (type) {
            case "mail":
                user.email= newString;
                return await this.UserRepository.save(user);
            case "name":
                user.name= newString;
                return await this.UserRepository.save(user);
            case "firstname":
                user.firstname= newString;
                return await this.UserRepository.save(user);
            default:
                return;
        }
    }
}