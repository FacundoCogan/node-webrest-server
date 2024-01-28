import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";

export class TodosController{

    //* DI 
    constructor(
        private readonly todoRepository: TodoRepository,
    ){}

    //! ARQUITECTURA Domain-Driven Design 

    public getTodos =  async(req:Request, res:Response) => {

        const todos = await this.todoRepository.getAll();
        return res.json(todos);
    }

    public getTodoById = async(req:Request, res:Response) => {
        const id = +req.params.id;
        try {
            const todoById = await this.todoRepository.findById(id);
            res.json(todoById);
            
        } catch (error) {
            res.status(400).json({ error});
        }
        
        
    }

    public createTodo = async(req:Request, res:Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if(error) return res.status(400).json({error: error});

        const createdTodo = await this.todoRepository.create(createTodoDto!)

        
        res.json(createdTodo);

    };
    
    public updateTodo = async(req:Request, res:Response) => {

        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if (error) return res.status(400).json({error: error});

        
        const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);

        res.json(updatedTodo);

    }

    public deleteTodo = async(req:Request, res:Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({error: `ID argument must be a number`});

        const deletedTodo = await this.todoRepository.deleteById(id);
    
        res.json(deletedTodo);


        
    }
}