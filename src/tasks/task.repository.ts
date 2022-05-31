import { InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository, UsingJoinTableIsNotAllowedError } from "typeorm";
import { CretaeTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-task-filter.dto";
import { Task, TaskStatus } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId : user.id })
        if (status) {
            query.andWhere('task.status = :status', {status});
        }
        if (search) {
            query.andWhere('(task.title Like :search OR task.description Like :search)',{search: `%${search}%`});
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get Tasks for user '${user.username}'. Filters ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createTask(creatTaskDto:CretaeTaskDto, user: User): Promise<Task> {
        const {title, description} = creatTaskDto;

        const newTask = new Task();
        newTask.title = title;
        newTask.description = description;
        newTask.status = TaskStatus.OPEN;
        newTask.user = user;

        await newTask.save();
        delete newTask.user;
        return newTask;
    }
}