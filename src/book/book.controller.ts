import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  CreateBookDTO,
  ParamBookDTO,
  QueryBookDTO,
  UpdateBookDTO,
} from './book.dto';

@Controller('book')
export class BookController {
  constructor(private booksService: BookService) {}

  @Get()
  getAllbook(@Query() filter: QueryBookDTO) {
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

  // @Put('/:id')
  // updateBook(@Param() param: ParamBookDTO, @Body() payload: UpdateBookDTO) {
  //   return this.booksService.updateBook(param.id, payload);
  // }

  // @Delete('/:id')
  // deleteBook(@Param() param: ParamBookDTO) {
  //   return this.booksService.deleteBook(param.id);
  // }
}
