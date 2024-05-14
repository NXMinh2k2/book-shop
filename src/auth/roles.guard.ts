/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    console.log(requiredRoles);
    const user_data = context.switchToHttp().getRequest().user_data;
    const user = await this.userModel.findById(user_data.id).lean().exec();

    return requiredRoles.some((role) => user.roles.includes('superAdmin'));
  }
}
