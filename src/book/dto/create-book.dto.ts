/* eslint-disable prettier/prettier */
import { IsEmpty, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../schemas/book.schema';
import { User } from 'src/auth/schema/user.schema';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  readonly description: string;
  readonly author: string;
  readonly price: number;
  readonly image: Blob;

  @IsEnum(Category, { message: 'please enter correct category' })
  readonly category: Category;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
