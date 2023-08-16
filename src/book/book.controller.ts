import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('book')
export class BookController {
  @Get('/:name')
  hello(@Param('name') name: string) {
    return `Hello ${name}`;
  }

  @Post()
  createBook(@Body() payload: any) {
    return payload;
  }
}
