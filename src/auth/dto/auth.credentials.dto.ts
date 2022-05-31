import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCreadentialsDto {
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(15)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message:   `password to Weak`})
    password: string;
}