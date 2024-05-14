"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schema/user.schema");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(userModel, jwtService, configService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signUp(signUpDto) {
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
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new common_1.UnauthorizedException('Invalid Password');
        }
        const token = this.generateToken({ id: user._id });
        return token;
    }
    async refreshToken(refresh_token) {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get('JWT_SECRET'),
                maxAge: this.configService.get('JWT_EXPIRES'),
            });
            const checkExistToken = await this.userModel.findOne({
                _id: verify.id,
            });
            if (checkExistToken) {
                return this.generateToken({ id: verify._id });
            }
            else {
                throw new common_1.HttpException('Refresh token is not valid', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new common_1.HttpException('Refresh token is not valid', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async generateToken(payload) {
        const access_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET_ACCESS_TOKEN'),
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET_REFRESH_TOKEN'),
        });
        await this.userModel.updateOne({ _id: payload.id }, { refresh_token: refresh_token });
        return { access_token, refresh_token };
    }
    async createSuperAdmin(signUpDto) {
        const existingSuperAdmin = await this.userModel.findOne({
            roles: user_schema_1.UserRole.SuperAdmin,
        });
        if (existingSuperAdmin) {
            throw new Error('Super admin already exists.');
        }
        const { name, email, password } = signUpDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const superAdmin = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            roles: [user_schema_1.UserRole.SuperAdmin],
        });
        return superAdmin;
    }
    async assignRoles(userId, roles) {
        const user = await this.userModel.findByIdAndUpdate(userId, { roles }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map