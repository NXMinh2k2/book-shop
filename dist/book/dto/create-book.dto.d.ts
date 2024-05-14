import { Category } from '../schemas/book.schema';
import { User } from 'src/auth/schema/user.schema';
export declare class CreateBookDto {
    readonly title: string;
    readonly description: string;
    readonly author: string;
    readonly price: number;
    readonly image: Blob;
    readonly category: Category;
    readonly user: User;
}
