import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCreadentialsDto } from './dto/auth.credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}

    async signUp(authCredentialsDto: AuthCreadentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCreadentialsDto): Promise<{ accessToken: string}> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
