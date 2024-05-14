import {
  Body,
  Controller,
  Param,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './skipAuthGuard';
import { User, UserRole } from './schema/user.schema';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('/login')
  login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    console.log(loginDto);
    return this.authService.login(loginDto);
  }

  @Post('refresh_token')
  refreshtoken(@Body() { refresh_token }): Promise<any> {
    return this.authService.refreshToken(refresh_token);
  }

  @Public()
  @Post('create-super-admin')
  async createSuperAdmin(@Body() signUpDto: SignUpDto): Promise<User> {
    const superAdmin = await this.authService.createSuperAdmin(signUpDto);
    return superAdmin;
  }

  @Post('assign-roles/:userId')
  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['superAdmin'])
  async assignRoles(
    @Param('userId') userId: string,
    @Body('roles') roles: UserRole[],
  ) {
    const updatedUser = await this.authService.assignRoles(userId, roles);
    return updatedUser;
  }
}
