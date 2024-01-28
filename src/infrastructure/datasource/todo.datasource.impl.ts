import { prisma } from "../../data/postgres";
import { CreateTodoDto, TodoDatasource, TodoEntity, UpdateTodoDto } from "../../domain";
import { CustomError } from "../../domain";



export class TodoDatasourceImpl implements TodoDatasource{

    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        return TodoEntity.fromObject(todo);
    }
    
    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany();

        return todos.map(todo => TodoEntity.fromObject(todo));
    }

    async findById(id: number): Promise<TodoEntity> {
        const todoById = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });

        if(!todoById) throw new CustomError(`Todo with id ${id} not found`, 404);
        return TodoEntity.fromObject(todoById);
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        await this.findById(updateTodoDto.id);

        const todoUpdate = await prisma.todo.update({
            where: {
                id: updateTodoDto.id
            },
            data: updateTodoDto!.values
        });

        return TodoEntity.fromObject(todoUpdate);
    }

    async deleteById(id: number): Promise<TodoEntity> {
        await this.findById(id);

        const todoDelete = await prisma.todo.delete({
            where: {
                id
            }
        });

        return TodoEntity.fromObject(todoDelete);
    }
}