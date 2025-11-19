'use server'
import boardsModel from "@/lib/mongodb/models/boards.model";
import columnsModel from "@/lib/mongodb/models/columns.model";
import tasksModel from "@/lib/mongodb/models/tasks.model";
import { Board, Column, Task } from "@/types";
import { connectDB } from "../lib/mongodb/db";

export async function getBoards(user_email: string) {
	await connectDB()
	const boards = await boardsModel.find({ user_email })
	return boards
}
export async function createBoard(board: Omit<Board, '_id' | 'created_at' | 'updated_at' | 'description' | 'color'>) {
	await connectDB()
	const newBoard = await boardsModel.create(board)
	return newBoard
}
export async function getBoard(board_id: string) {
	await connectDB()
	const board = await boardsModel.findById(board_id)
	return board
}
export async function updateBoard({ board_id, title, color }: { board_id: string, title: string, color: string }) {
	await connectDB()
	const updatedBoard = await boardsModel.updateOne({ _id: board_id }, { $set: { title, color } })
	return updatedBoard
}

// Column Service

export async function updateColumn({ column_id, title }: { column_id: string, title: string }) {
	await connectDB()
	console.log(column_id, title)
	const updatedColumn = await columnsModel.updateOne({ _id: column_id }, { $set: { title } })
	return updatedColumn
}

export async function createColumn(column: Omit<Column, '_id' | 'created_at' | 'updated_at'>) {
	await connectDB()
	const newColumn = await columnsModel.create(column)
	return newColumn
}
export async function deleteColumn({ column_id }: { column_id: string }) {
	await connectDB()
	const deletedColumn = await columnsModel.deleteOne({ _id: column_id })
	return deletedColumn
}


// Task Service

export async function createTask(task: Omit<Task, '_id' | 'created_at' | 'updated_at' | 'sort_order'>) {
	await connectDB()
	const newTask = await tasksModel.create(task)
	return newTask
}
export async function updateTask({ task_id, task }: { task_id: string, task: Omit<Task, '_id' | 'created_at' | 'updated_at'> }) {
	await connectDB()
	const updatedTask = await tasksModel.updateOne({ _id: task_id }, { $set: task })
	return updatedTask
}
export async function deleteTask({ task_id }: { task_id: string }) {
	await connectDB()
	const deletedTask = await tasksModel.deleteOne({ _id: task_id })
	return deletedTask
}
