import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/service/user.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, 
    private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
      const user = await this.userService.findOneByEmail(email);
      if (user && bcrypt.compareSync(pass, user.password)){
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    

  async login(use: any) {
    const user = await this.validateUser(use.email, use.password)
    if (!user) {
        throw new UnauthorizedException();
    }
    const payload = { id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      token_type : " Bearer",
    };
  }
}