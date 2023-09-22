import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: `${process.env.SECRET_KEY_JWT}`,
  signOptions: {
    expiresIn: 60,
  },
};
