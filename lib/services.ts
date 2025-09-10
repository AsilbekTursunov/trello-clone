// import { SupabaseClient } from '@supabase/supabase-js'
// import { Board, Column, Task } from '../types'
// import { createClient } from './supabase/server'

// export const boardService = {
// 	async getBoards(userId: string): Promise<Board[]> {
// 		const supabase = await createClient()
// 		const { data, error } = await supabase
// 			.from('boards')
// 			.select('*')
// 			.eq('user_id', userId)
// 			.order('created_at', { ascending: false })

// 		if (error) throw error

// 		return data || []
// 	},

// 	async createBoard(board: Omit<Board, 'id' | 'created_at' | 'updated_at'>): Promise<Board> {
// 		const supabase = await createClient()

// 		const { data, error } = await supabase.from('boards').insert(board).select().single()

// 		if (error) throw error

// 		return data
// 	},
// }

// export const columnService = {
// 	async createColumn(column: Omit<Column, 'id' | 'created_at'>) {
// 		const supabase = await createClient()
// 		const { data, error } = await supabase.from('columns').insert(column).select().single()

// 		if (error) throw error

// 		return data
// 	},
// }

// export const boardServiceWithColumn = {
// 	async createBoardWithColumns(board: {
// 		title: string
// 		description?: string
// 		color?: string
// 		user_id: string
// 	}) {
// 		const newBoard = await boardService.createBoard({
// 			title: board.title,
// 			description: board.description || null,
// 			color: board.color || 'bg-blue-500',
// 			user_id: board.user_id,
// 		})

// 		const defaultColumns = [
// 			{ title: 'To Do', sort_order: 0 },
// 			{ title: 'In Progress', sort_order: 1 },
// 			{ title: 'Review', sort_order: 2 },
// 			{ title: 'Done', sort_order: 3 },
// 		]

// 		await Promise.all(
// 			defaultColumns.map(column =>
// 				columnService.createColumn({ ...column, user_id: board.user_id, board_id: newBoard._id! })
// 			)
// 		)

// 		return newBoard
// 	},
// }
