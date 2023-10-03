import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginDTO, refreshAccessTokenDTO } from './auth.dto';
import { loginResponse } from './auth.interface';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.entity';
import { RefreshToken } from './auth.refresh.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { TokenExpiredError } from 'jsonwebtoken';

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

  async decodeToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token is expired');
      } else {
        throw new InternalServerErrorException('Failed to decode token');
      }
    }
  }

  async refreshAccessToken(
    token: refreshAccessTokenDTO,
  ): Promise<{ access_token: string }> {
    const { refresh_token } = token;
    const payload = await this.decodeToken(refresh_token);

    const data = await this.refreshTokenRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: payload.id,
      },
    });

    if (!data) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (data.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (new Date(data.expiredAt) < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    const access_token = await this.createAccessToken(data.user.id);
    return { access_token };
  }

  async revokeToken(id: string) {
    const refreshToken = await this.refreshTokenRepository.findOneBy({ id });

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found');
    }

    await this.refreshTokenRepository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({
        isRevoked: true,
      })
      .where('id = :id', { id })
      .execute();

    return {
      message: 'Revoke token success',
    };
  }
}
