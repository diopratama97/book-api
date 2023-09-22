import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUsersDTO } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  createBook(@Body() payload: RegisterUsersDTO) {
    return this.usersService.registerUsers(payload);
  }
}
