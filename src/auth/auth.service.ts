import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserRole } from './schema/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken({ id: user._id });
    return token;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid Password');
    }

    const token = this.generateToken({ id: user._id });
    return token;
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        maxAge: this.configService.get<string | number>('JWT_EXPIRES'),
      });
      const checkExistToken = await this.userModel.findOne({
        _id: verify.id,
      });

      if (checkExistToken) {
        return this.generateToken({ id: verify._id });
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async generateToken(payload: { id: ObjectId }) {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
    });

    await this.userModel.updateOne(
      { _id: payload.id },
      { refresh_token: refresh_token },
    );

    return { access_token, refresh_token };
  }

  async createSuperAdmin(signUpDto: SignUpDto): Promise<User> {
    const existingSuperAdmin = await this.userModel.findOne({
      roles: UserRole.SuperAdmin,
    });

    if (existingSuperAdmin) {
      // Super admin already exists
      throw new Error('Super admin already exists.');
    }

    const { name, email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [UserRole.SuperAdmin],
    });

    return superAdmin;
  }

  async assignRoles(userId: string, roles: UserRole[]): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { roles },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
