/* eslint-disable prettier/prettier */
import { User } from 'src/auth/schema/user.schema';
import { Category } from '../schemas/book.schema';
import { IsEmpty } from 'class-validator';

export class UpdateBookDto {
  readonly title: string;
  readonly description: string;
  readonly author: string;
  readonly price: number;
  readonly category: Category;
  readonly image: Blob;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
