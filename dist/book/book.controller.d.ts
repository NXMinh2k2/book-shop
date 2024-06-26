import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Category } from './schemas/category.schema';
export declare class BookController {
    private bookService;
    constructor(bookService: BookService);
    getAllBooks(query: ExpressQuery): Promise<Book[]>;
    getAllCategories(): Promise<Category[]>;
    createBook(book: CreateBookDto): Promise<any>;
    getBookById(id: string): Promise<Book>;
    updateBook(id: string, book: UpdateBookDto): Promise<Book>;
    deleteBook(id: string): Promise<Book>;
}
