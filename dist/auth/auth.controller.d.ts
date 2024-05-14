import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from './schema/user.schema';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshtoken({ refresh_token }: {
        refresh_token: any;
    }): Promise<any>;
    createSuperAdmin(signUpDto: SignUpDto): Promise<User>;
    assignRoles(userId: string, roles: UserRole[]): Promise<User>;
}
