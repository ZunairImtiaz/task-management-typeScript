import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from './jwt.strategy';
import * as config from "config";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy:'jwt' }),
        JwtModule.register({ secret: process.env.JWT_SECRET || config.get('jwt.secret'), signOptions: {expiresIn: config.get('jwt.expiresIn')}}),
        TypeOrmModule.forFeature([UserRepository])
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
