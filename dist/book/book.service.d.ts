/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Book } from './schemas/book.schema';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { Category } from './schemas/category.schema';
export declare class BookService {
    private bookModel;
    private categoryModel;
    constructor(bookModel: Model<Book>, categoryModel: Model<Category>);
    findAll(query: Query): Promise<(mongoose.Document<unknown, {}, Book> & Book & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    findAllCategory(): Promise<(mongoose.Document<unknown, {}, Category> & Category & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    create(book: Book): Promise<Book>;
    findById(id: string): Promise<Book>;
    updateById(id: string, book: Book): Promise<Book>;
    deleteById(id: string): Promise<mongoose.Document<unknown, {}, Book> & Book & {
        _id: mongoose.Types.ObjectId;
    }>;
}
