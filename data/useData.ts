'use client'
import { Board, Task, ColumnWithTasks } from '@/types'
import axios from 'axios'
import { create } from 'zustand'


interface IDataProp {
  boards: Board[] | null,
  board: Board | null,
  isBoardsLoading: boolean,
  isBoardLoading: boolean,
  columns: ColumnWithTasks[] | null,
  getBaords: (user_email: string) => Promise<void>,
  getBoard: (id: string) => Promise<void>,
  createBoard: (title: string, user_email: string) => Promise<void>,
  updateBoard: (title: string, board_id: string) => Promise<void>,
  deleteBoard: (id: string) => Promise<void>,
  createColumn: (title: string, board_id: string) => Promise<void>,
  updateColumn: (title: string, column_id: string) => Promise<void>,
  deleteColumn: (id: string) => Promise<void>,
  createTask: (task: Omit<Task, '_id' | 'created_at' | 'updated_at'>) => Promise<void>,
  updateTask: (title: string, task_id: string) => Promise<void>,
  deleteTask: (id: string) => Promise<void>,
}


export const useData = create<IDataProp>((set, get) => ({
  boards: null,
  board: null,
  isBoardsLoading: false,
  isBoardLoading: false,
  columns: null,
  getBaords: async (user_email: string) => {
    if (user_email) {
      set({ isBoardsLoading: true })
      const response = await axios.get('/api/board/get-all', { params: { user_email } })
      set({ boards: response.data.boards })
      set({ isBoardsLoading: false })
    }
  },
  getBoard: async (id: string) => {
    set({ isBoardLoading: true })
    const response = await axios.get('/api/board/get-one', { params: { board_id: id } })
    set({ board: response.data.board || null, columns: response.data.columnsWithTasks || null })
    set({ isBoardLoading: false })
  },
  createBoard: async (title: string, user_email: string) => {
    const response = await axios.post('/api/board/create', { title, user_email })
    set({ boards: [...(get().boards || []), response.data] })
  },
  updateBoard: async (title: string, board_id: string) => {
    set({ boards: get().boards?.map(board => board._id === board_id ? { ...board, title } : board) })
    const response = await axios.put('/api/board/update', { title, board_id })
    console.log(response.data)
  },
  deleteBoard: async (id: string) => {
    set({ boards: get().boards?.filter(board => board._id !== id) })
    const response = await axios.delete('/api/board/delete', { params: { board_id: id } })
    console.log(response.data)
  },
  createColumn: async (title: string, board_id: string) => {
    const response = await axios.post('/api/column/create', { title, board_id })
    set({ columns: [...(get().columns || []), response.data] })
  },
  updateColumn: async (title: string, column_id: string) => {
    const response = await axios.put('/api/column/update', { title, column_id })
    set({ columns: get().columns?.map(column => column._id === column_id ? { ...column, title } : column) })
    console.log(response.data)
  },
  deleteColumn: async (id: string) => {
    set({ columns: get().columns?.filter(column => column._id !== id) })
    const response = await axios.delete('/api/column/delete', { params: { column_id: id } })
    console.log(response.data)
  },
  createTask: async (task: Omit<Task, '_id' | 'created_at' | 'updated_at'>) => {
    const response = await axios.post('/api/task/create', task)
    set({ columns: get().columns?.map(column => column._id === task.column_id ? { ...column, tasks: [...column.tasks, response.data] } : column) })
    console.log(response.data)
  },
  updateTask: async (title: string, task_id: string) => {
    const response = await axios.put('/api/task/update', { title, task_id })
    set({ columns: get().columns?.map(column => column.tasks.some(task => task._id === task_id) ? { ...column, tasks: column.tasks.map(task => task._id === task_id ? { ...task, title } : task) } : column) })
    console.log(response.data)
  },
  deleteTask: async (id: string) => {
    set({ columns: get().columns?.map(column => column.tasks.some(task => task._id === id) ? { ...column, tasks: column.tasks.filter(task => task._id !== id) } : column) })
    const response = await axios.delete('/api/task/delete', { params: { task_id: id } })
    console.log(response.data)
  },
}))