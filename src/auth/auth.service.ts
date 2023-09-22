import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginDTO } from './auth.dto';
import { loginResponse } from './auth.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(payload: loginDTO): Promise<loginResponse> {
    const { email, password } = payload;

    const validate = await this.usersService.validateLogin(email, password);

    const createAccessToken = await this.createAccessToken(validate.id);

    return { access_token: createAccessToken, refresh_token: '' };
  }

  async createAccessToken(userId: string): Promise<string> {
    const payload = {
      userId,
    };

    const access_token = this.jwtService.signAsync(payload);
    return access_token;
  }
}
