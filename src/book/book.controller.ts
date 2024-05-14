/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  // SetMetadata,
  // UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
// import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/skipAuthGuard';
import { Category } from './schemas/category.schema';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  // @SetMetadata('roles', ['1'])
  @Public()
  @Get()
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.bookService.findAll(query);
  }

  @Public()
  @Get('/categories')
  async getAllCategories(): Promise<Category[]> {
    return this.bookService.findAllCategory();
  }

  @Public()
  @Post()
  // @UseGuards(AuthGuard)
  async createBook(@Body() book: CreateBookDto): Promise<any> {
    return this.bookService.create(book);
  }

  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Public()
  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateById(id, book);
  }

  @Public()
  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<Book> {
    return this.bookService.deleteById(id);
  }
}
