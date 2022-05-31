import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CretaeTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    private logger = new Logger('TaskController')

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User '${user.username}' retreving all tasks. Filters ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get(':id')
    getTaskById(@Param('id',ParseIntPipe ) id: number, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() creatTaskDto: CretaeTaskDto, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User '${user.username}' creating a new task. Data ${JSON.stringify(creatTaskDto)}`);
        return this.tasksService.createTask(creatTaskDto, user);
    }

    @Delete(':id')
    deleteTask(@Param('id',ParseIntPipe) id: number, @GetUser() user: User): Promise<void>  {
        return this.tasksService.deleteTask(id, user);
    }

    @Patch(':id/status')
    updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body('status',TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
        ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id,status, user);
    }
}
