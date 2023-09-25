import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: `${process.env.SECRET_KEY_JWT}`,
  signOptions: {
    expiresIn: 60,
  },
};

export const refreshTokenConfig: JwtSignOptions = {
  expiresIn: 3600 * 24,
};
