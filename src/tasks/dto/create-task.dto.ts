import { IsNotEmpty } from "class-Validator";

export class CretaeTaskDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;
}