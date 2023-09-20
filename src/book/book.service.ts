import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDTO, QueryBookDTO, UpdateBookDTO } from './book.dto';

@Injectable()
export class BookService {
  private book: any[] = [];

  getAllbook(filter: QueryBookDTO): any[] {
    const { title, category } = filter;

    const findBook = this.book.filter((b) => {
      let isMatch = true;
      if (title && b.title !== title) {
        isMatch = false;
      }
      if (category && b.category !== category) {
        isMatch = false;
      }
      return isMatch;
    });
    return findBook;
  }

  getOneBook(id: string) {
    const bookIdx = this.findBookById(id);
    return this.book[bookIdx];
  }

  createBook(payload: CreateBookDTO) {
    const { title, author, category, year } = payload;
    this.book.push({
      id: uuidv4(),
      title,
      author,
      category,
      year,
    });

    return {
      message: 'Book Create',
    };
  }

  updateBook(id: string, payload: UpdateBookDTO) {
    const bookIdx = this.findBookById(id);
    const { title, category, author, year } = payload;
    this.book[bookIdx].title = title;
    this.book[bookIdx].category = category;
    this.book[bookIdx].author = author;
    this.book[bookIdx].year = year;

    return {
      message: 'Book Update',
    };
  }

  findBookById(id: string) {
    const findBook = this.book.findIndex((b) => b.id === id);
    if (findBook === -1) {
      throw new NotFoundException(`Book id : ${id} not found`);
    }

    return findBook;
  }

  deleteBook(id: string) {
    const bookIdx = this.findBookById(id);
    this.book.splice(bookIdx, 1);

    return {
      message: 'Delete Success',
    };
  }
}
