import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RegisterUsersDTO } from './users.dto';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<Users>,
  ) {}

  async registerUsers(payload: RegisterUsersDTO) {
    const salt = await bcrypt.genSalt();
    const { email, name, password } = payload;

    const checkEmail = await this.usersRepository.findOneBy({ email });

    if (checkEmail) {
      throw new ConflictException(`Email ${email} already exist`);
    }

    await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values([
        {
          id: uuidv4(),
          email,
          name,
          password: await bcrypt.hash(password, salt),
          salt,
        },
      ])
      .execute();

    return { message: 'Success Register' };
  }

  async validateLogin(email: string, password: string): Promise<Users> {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new NotFoundException(`Email ${email} not registered`);
    }

    const validatePassword = await bcrypt.hash(password, user.salt);

    if (validatePassword !== user.password) {
      throw new BadRequestException(`Password ${password} not match`);
    }

    return user;
  }
}
