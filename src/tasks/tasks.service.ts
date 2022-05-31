import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CretaeTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { Task, TaskStatus } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private readonly taskRepository: TaskRepository) {}
    
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found: Task = await this.taskRepository.findOne({ where:{id, userId: user.id}});
        if (!found) {
            throw new NotFoundException(`Task with  ID "${id}" Not found`);
        }
        return found;
    }

    async createTask(creatTaskDto: CretaeTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(creatTaskDto, user)
    }

    async deleteTask(id:number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});
        if (result.affected === 0) {
            throw new NotFoundException(`Task with  ID "${id}" Not found`);
        }   
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task: Task = await this.getTaskById(id,user);
        task.status = status;
        await task.save();
        return task;
    }
}
