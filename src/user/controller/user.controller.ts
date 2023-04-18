import * as bcrypt from 'bcrypt';
import { Request, Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, UsePipes, ValidationPipe, UseGuards, ForbiddenException, ParseUUIDPipe } from "@nestjs/common";
import { Account, AccountJWT } from '../model/user.model';
import { UserService } from "../service/user.service";
import { User } from "../entity/user.entity";
import { CreateUserDTO, LoginUserDTO, UpdateRoleDTO, ChangePasswordDTO, ChangeDTO } from "../dto/user.dto";
import { AuthService } from '../../auth/services/auth.service';
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import verifyUUID from "src/utils/uuid.verify";
import { ApiTags } from "@nestjs/swagger";


@Controller('users')
export class UserController {
  constructor(
    private readonly UsersService: UserService,
    private readonly AuthService: AuthService,
    ) {}

    @Get()
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req : any): Promise<User[]> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        }
        return await this.UsersService.findAll();
    }

    @Get('account')
    @ApiTags('User')
    @UseGuards(JwtAuthGuard)
    async myAccount(@Request() req : any ){
        console.log('account')
        console.log(req)
        const user = await this.UsersService.findOneById(req.user.id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return new Account(user.id, user.name, user.firstname, user.email, user.role);
    }

    @Get(':id')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Request() req:any): Promise<Account> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        }
        const user = await this.UsersService.findOneById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return new Account(user.id, user.name, user.firstname, user.email, user.role)
    }


    @Post('setrole')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async setRole(@Body() body : UpdateRoleDTO, @Request() req :any): Promise<Account> {
        if (req.user.role != "Admin") {
            throw new ForbiddenException();
        } else if(!verifyUUID(body.id) ) {
            throw new ForbiddenException('Invalid UUID')
        }
        let user = await this.UsersService.findOneById(body.id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user = await this.UsersService.updateRole(user.id, body.role);
        return new Account(user.id, user.name, user.firstname, user.email, user.role)
    }

    @Post('register')
    @ApiTags('User')
    @UsePipes(ValidationPipe)
    async create(@Body() body: CreateUserDTO): Promise<AccountJWT>{
        body.email = body.email.toLowerCase()
        const findUser = await this.UsersService.findOneByEmail(body.email);
        if (findUser) {
            throw new ForbiddenException('Email already exists')
        } else if (body.password != body.confirmpassword) {
            throw new ForbiddenException('Passwords do not match')
        }
        //send info to register service and return user with jwt
        const user = await this.UsersService.create(body);
        const jwt = await this.AuthService.register(user.id);
        const jwtAccount = new AccountJWT(user.id, user.name, user.firstname, user.email, user.role,  jwt.access_token);
        return jwtAccount;
    }

    @Post('login')
    @ApiTags('User')
    @UsePipes(ValidationPipe)
    async login(@Body() body: LoginUserDTO): Promise<AccountJWT> {
        body.email = body.email.toLowerCase()
        const user = await this.UsersService.findOneByEmail(body.email);
        if (!user) {
            throw new HttpException("Account does not exist", HttpStatus.FORBIDDEN);
        }
        //send info to login service and return user with jwt
        const jwt = await this.AuthService.login(body);
        const jwtAccount = new AccountJWT(user.id, user.name, user.firstname, user.email, user.role,  jwt.access_token);
        return jwtAccount;
    }

    @Post('change-password')
    @ApiTags('User')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    async changePassword(@Body() body: ChangePasswordDTO, @Request() req: any): Promise<Account> {
        const user = await this.UsersService.findOneById(req.user.id)
        if (!user) {
            throw new NotFoundException('User not Found')
        }
        //verify if new password is the same
        if(body.newPassword!== body.confirmNewPassword){
            throw new ForbiddenException('Passwords do not match')
            
        }
        //verify if old password is same as new password
        if(bcrypt.compareSync(body.oldPassword, user.password)){
            await this.UsersService.changePWD(user.id, body.newPassword)
        }
        return new Account(user.id, user.name, user.firstname, user.email, user.role)
    }

    @Post('change-profil')
    @ApiTags('User')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    async changeEmail(@Body() body: ChangeDTO, @Request() req: any): Promise<Account> {
        const user = await this.UsersService.findOneById(req.user.id);
        if (!user) {
            throw new NotFoundException('User not Found');
        }
        //change user info with type: mail/name/firstname
        switch (body.type.toLowerCase()) {
            case 'mail':
                const finduser = await this.UsersService.findOneByEmail(body.new);
                if(finduser){
                    throw new ForbiddenException('Already account bind with this mail');
                }
                await this.UsersService.changeProfil(user.id, body.new,'mail');
                return new Account(user.id, user.name, user.firstname, body.new, user.role);
            case 'name':
               await this.UsersService.changeProfil(user.id, body.new,'name');
               return new Account(user.id, body.new, user.firstname, user.email, user.role)
            case 'firstname':
               await this.UsersService.changeProfil(user.id, body.new,'firstname');
               return new Account(user.id, user.name, body.new, user.email, user.role)
            default:
                throw new ForbiddenException('Type is not equals to mail or name or firstname')
        }
    }
}