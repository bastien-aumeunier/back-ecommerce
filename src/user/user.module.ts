import {forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service"
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(()=> AuthModule)],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
  })
  export class UserModule { }