import { Account, AccountJWT } from '../entity/user.class';
import { Request, Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, UsePipes, ValidationPipe, UseGuards, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { User } from "../entity/user.entity";
import { CreateUserDTO, LoginUserDTO, UpdateRoleDTO } from "../dto/user.dto";
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
            throw new UnauthorizedException();
        }
        return this.UsersService.findAll();
    }

    @Get('account')
    @ApiTags('User')
    @UseGuards(JwtAuthGuard)
    async myAccount(@Request() req : any): Promise<Account>{
        const user = await this.UsersService.findOneById(req.user.id);
        if (!user) {
            throw new NotFoundException();
        }
        const user2 =  new Account(user.id, user.email, user.role, user.name, user.firstname);
        return user2;

    }

    @Get(':id')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id, @Request() req :any): Promise<User> {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        }  else if(!verifyUUID(id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        } 
        const user = await this.UsersService.findOneById(id);
        if (!user) {
            throw new NotFoundException();
        }
        user.password = ""
        return user;
    }


    @Post('setrole')
    @ApiTags('Admin')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async setRole(@Body() body : UpdateRoleDTO, @Request() req :any) {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        } else if(!verifyUUID(body.id) ) {
            throw new HttpException("Invalid UUID", HttpStatus.FORBIDDEN);
        }
        const user = await this.UsersService.findOneById(body.id);
        if (!user) {
            throw new NotFoundException();
        }
        return await this.UsersService.updateRole(user, body.role);
    }

    @Post('register')
    @ApiTags('User')
    @UsePipes(ValidationPipe)
    async create(@Body() user: CreateUserDTO){
        const user2 = await this.UsersService.findOneByEmail(user.email);
        if (user2) {
            throw new HttpException("Email already exists", HttpStatus.FORBIDDEN);
        } else if (user.password != user.confirmpassword) {
            throw new HttpException("Passwords do not match", HttpStatus.FORBIDDEN);
        }
        const user3 = await this.UsersService.create(user);
        const jwt = await this.AuthService.register(user3.id);
        const jwtAccount = new AccountJWT(user3.id, user3.email, user3.role, user3.name, user3.firstname, jwt.access_token);
        return jwtAccount;
    }

    @Post('login')
    @ApiTags('User')
    @UsePipes(ValidationPipe)
    async login(@Body() user: LoginUserDTO) {
        const user2 = await this.UsersService.findOneByEmail(user.email);
        if (!user2) {
            throw new HttpException("Account does not exist", HttpStatus.FORBIDDEN);
        }
        const jwt = await this.AuthService.login(user);
        const jwtAccount = new AccountJWT(user2.id, user2.email, user2.role, user2.name, user2.firstname, jwt.access_token);
        return jwtAccount;
    }

  }