import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO, refreshAccessTokenDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() payload: loginDTO) {
    return this.authService.login(payload);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() payload: refreshAccessTokenDTO) {
    return this.authService.refreshAccessToken(payload);
  }
}
