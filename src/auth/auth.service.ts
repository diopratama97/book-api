import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginDTO } from './auth.dto';
import { loginResponse } from './auth.interface';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.entity';
import { RefreshToken } from './auth.refresh.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { refreshTokenConfig } from 'src/config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(payload: loginDTO): Promise<loginResponse> {
    const { email, password } = payload;

    const validate = await this.usersService.validateLogin(email, password);

    const createAccessToken = await this.createAccessToken(validate.id);
    const createRefreshToken = await this.createRefreshToken(validate);

    return {
      access_token: createAccessToken,
      refresh_token: createRefreshToken,
    };
  }

  async createAccessToken(userId: string): Promise<string> {
    const payload = {
      userId,
    };

    const access_token = this.jwtService.signAsync(payload);
    return access_token;
  }

  async createRefreshToken(user: Users): Promise<string> {
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 1);

    const datas = {
      id: uuidv4(),
      user,
      isRevoked: false,
      expiredAt,
    };

    const payloadJwt = {
      id: datas.id,
    };

    await this.refreshTokenRepository
      .createQueryBuilder()
      .insert()
      .into(RefreshToken)
      .values(datas)
      .execute();

    const refresh_token = await this.jwtService.signAsync(
      payloadJwt,
      refreshTokenConfig,
    );

    return refresh_token;
  }
}
