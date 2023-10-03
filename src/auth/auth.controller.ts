import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO, refreshAccessTokenDTO } from './auth.dto';
import { JwtGuards } from './auth.jwt.guards';

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

  @Patch('/:id/revoke')
  @UseGuards(JwtGuards)
  async revokeToken(@Param() param: { id: string }) {
    return this.authService.revokeToken(param.id);
  }
}
