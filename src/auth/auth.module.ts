import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategies';

@Module({
    imports: [forwardRef(() => UserModule), PassportModule,
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '7d' },
      }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
  })
export class AuthModule {}
