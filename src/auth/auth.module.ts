import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { refreshTokenProvider } from './auth.provider';
import { DatabaseModule } from 'src/config/database.module';
import { JwtStrategy } from './auth.jwt.strategy';

@Module({
  imports: [JwtModule.register(jwtConfig), UsersModule, DatabaseModule],
  providers: [AuthService, ...refreshTokenProvider, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
