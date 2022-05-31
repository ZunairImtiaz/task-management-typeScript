import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task.entity";

export class TaskStatusValidationPipe implements PipeTransform {
    private readonly allowedStatus = [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

    transform(value: any, metadata?: ArgumentMetadata) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new BadRequestException( `${value} is an invalid status`);
        }
        return value;
    }

    private isStatusValid(status: any) {
        const idx: any = this.allowedStatus.indexOf(status);
        return idx !== -1;
    }
}