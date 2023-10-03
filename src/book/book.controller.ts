import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  CreateBookDTO,
  ParamBookDTO,
  QueryBookDTO,
  UpdateBookDTO,
} from './book.dto';
import { getUser } from 'src/auth/auth.user.decorator';
import { Users } from 'src/users/users.entity';
import { JwtGuards } from 'src/auth/auth.jwt.guards';

@Controller('book')
@UseGuards(JwtGuards)
export class BookController {
  constructor(private booksService: BookService) {}

  @Get()
  getAllbook(@Query() filter: QueryBookDTO, @getUser() user: Users) {
    console.log(user);
    return this.booksService.getAllbook(filter);
  }

  @Get('/:id')
  getOnebook(@Param() param: ParamBookDTO) {
    return this.booksService.getOneBook(param.id);
  }

  @Post()
  createBook(@Body() payload: CreateBookDTO) {
    return this.booksService.createBook(payload);
  }

  @Put('/:id')
  updateBook(@Param() param: ParamBookDTO, @Body() payload: UpdateBookDTO) {
    return this.booksService.updateBook(param.id, payload);
  }

  @Delete('/:id')
  deleteBook(@Param() param: ParamBookDTO) {
    return this.booksService.deleteBook(param.id);
  }
}
