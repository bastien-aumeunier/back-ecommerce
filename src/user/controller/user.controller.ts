import { Request, Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, UsePipes, ValidationPipe, UseGuards, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { User } from "../entity/user.entity";
import { CreateUserDTO, LoginUserDTO, UpdateRoleDTO } from "../dto/user.dto";
import { AuthService } from '../../auth/services/auth.service';
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller('users')
export class UserController {
  constructor(
    private readonly UsersService: UserService,
    private readonly AuthService: AuthService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req : any): Promise<User[]> {
        if (req.user.role != "Admin") {
            console.log(req.user.role)
            throw new UnauthorizedException();
        }
        return this.UsersService.findAll();
    }

    @Get('account')
    @UseGuards(JwtAuthGuard)
    async myAccount(@Request() req : any){
        return await this.UsersService.findOneById(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id, @Request() req :any): Promise<User> {
        if (req.user.role != "Admin") {
            throw new UnauthorizedException();
        }  else {
            const user = await this.UsersService.findOneById(id);
            if (!user) {
                throw new NotFoundException();
            }
        return user;
        }
    }


    @Post('setrole')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async setRole(@Body() body : UpdateRoleDTO) {
        const id = body.id;
        const role = body.role;
        const user = await this.UsersService.findOneById(id);
        if (!user) {
            throw new NotFoundException();
        }
        return await this.UsersService.updateRole(user, role);
    }
    


    @Post('register')
    @UsePipes(ValidationPipe)
    async create(@Body() user: CreateUserDTO): Promise<User> {
        const user2 = await this.UsersService.findOneByEmail(user.email);
        if (user2) {
            throw new HttpException("Email already exists", HttpStatus.FORBIDDEN);
        } else if (user.password != user.confirmpassword) {
            throw new HttpException("Passwords do not match", HttpStatus.FORBIDDEN);
        }
        return this.UsersService.create(user);
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() user: LoginUserDTO) {
        return this.AuthService.login(user);
    }

  }