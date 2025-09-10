import boardsModel from "@/lib/mongodb/models/boards.model";
import columnsModel from "@/lib/mongodb/models/columns.model";
import tasksModel from "@/lib/mongodb/models/tasks.model";
import { Board, Column, Task } from "@/types";
import { connectDB } from "../lib/mongodb/db";

export const boardService = {
	async createBoard(board: Omit<Board, '_id' | 'created_at' | 'updated_at' | 'description' | 'color'>) {
		await connectDB()
		const newBoard = await boardsModel.create(board)
		return newBoard
	}
}

export const columnService = {
	async createColumn(column: Omit<Column, '_id' | 'created_at' | 'updated_at'>) {
		await connectDB()
		const newColumn = await columnsModel.create(column)
		return newColumn
	}
}

export const taskService = {
	async createTask(task: Omit<Task, '_id' | 'created_at' | 'updated_at'>) {
		await connectDB()
		const newTask = await tasksModel.create(task)
		return newTask
	}
}
