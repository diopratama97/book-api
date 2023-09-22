import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDTO, QueryBookDTO, UpdateBookDTO } from './book.dto';
import { Book } from './book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @Inject('BOOK_REPOSITORY')
    private bookRepository: Repository<Book>,
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
    const data = await this.bookRepository.findOneBy({ id });

    if (!data) {
      throw new NotFoundException(`Book id : ${id} not found`);
    }
    return data;
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

  async updateBook(id: string, payload: UpdateBookDTO) {
    const checkBook = await this.bookRepository.findOneBy({ id });

    if (!checkBook) {
      throw new NotFoundException(`Book id : ${id} not found`);
    }

    const { title, category, author, year } = payload;

    await this.bookRepository
      .createQueryBuilder()
      .update(Book)
      .set({
        title,
        author,
        category,
        year: Number(year),
      })
      .where('id = :id', { id })
      .execute();

    return {
      message: 'Book Update',
    };
  }

  async deleteBook(id: string) {
    const checkBook = await this.bookRepository.findOneBy({ id });

    if (!checkBook) {
      throw new NotFoundException(`Book id : ${id} not found`);
    }

    await this.bookRepository.delete(id);

    return {
      message: 'Delete Success',
    };
  }
}
