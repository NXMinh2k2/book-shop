/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: [
      { type: String, enum: ['admin', 'reporter', 'developer', 'superAdmin'] },
    ],
  })
  roles: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export enum UserRole {
  SuperAdmin = 'superAdmin',
  Admin = 'admin',
  Reporter = 'reporter',
  Developer = 'developer',
}
