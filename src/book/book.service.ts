import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDTO, QueryBookDTO, UpdateBookDTO } from './book.dto';
import { Book } from './book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @Inject('BOOK_REPOSITORY')
    public bookRepository: Repository<Book>,
  ) {}

  async getAllbook(filter: QueryBookDTO): Promise<Book[]> {
    const { title, category } = filter;

    const query = this.bookRepository.createQueryBuilder('book');

    if (title) {
      query.andWhere('lower(book.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      });
    }
    if (category) {
      query.andWhere('lower(book.category) LIKE :category', {
        category: `%${category.toLowerCase()}%`,
      });
    }

    return await query.getMany();
  }

  async getOneBook(id: string): Promise<Book> {
    return await this.bookRepository.findOneBy({ id });
  }

  async createBook(payload: CreateBookDTO) {
    const { title, author, category, year } = payload;

    await this.bookRepository
      .createQueryBuilder()
      .insert()
      .into(Book)
      .values([
        {
          id: uuidv4(),
          title,
          author,
          category,
          year: Number(year),
        },
      ])
      .execute();

    return { message: 'Success Create' };
  }

  // updateBook(id: string, payload: UpdateBookDTO) {
  //   const bookIdx = this.findBookById(id);
  //   const { title, category, author, year } = payload;
  //   this.book[bookIdx].title = title;
  //   this.book[bookIdx].category = category;
  //   this.book[bookIdx].author = author;
  //   this.book[bookIdx].year = year;

  //   return {
  //     message: 'Book Update',
  //   };
  // }

  // findBookById(id: string) {
  //   const findBook = this.book.findIndex((b) => b.id === id);
  //   if (findBook === -1) {
  //     throw new NotFoundException(`Book id : ${id} not found`);
  //   }

  //   return findBook;
  // }

  // deleteBook(id: string) {
  //   const bookIdx = this.findBookById(id);
  //   this.book.splice(bookIdx, 1);

  //   return {
  //     message: 'Delete Success',
  //   };
  // }
}
