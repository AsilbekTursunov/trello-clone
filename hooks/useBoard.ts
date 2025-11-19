'use client'
import { useUser } from "@clerk/nextjs"
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Board, ColumnWithTasks, Task } from "@/types"
import { useState } from "react"
import { createTask, getBoards, updateBoard, updateColumn } from "@/actions/index.action"


export const useBoard = ({ id }: { id: string }) => {
  const { user } = useUser()
  const [board, setBoard] = useState<Board | null>(null)
  const [columns, setColumns] = useState<ColumnWithTasks[] | null>(null)

  const { isLoading, error } = useQuery({
    queryKey: ['board'],
    queryFn: async () => {
      const response = await axios.get('/api/board/get', {
        headers: {
          'Content-Type': 'application/json',
        },
        params: { board_id: id },
      })
      setBoard(response.data.board)
      setColumns(response.data.columnsWithTasks.map((col: any) => ({ ...col._doc, tasks: col.tasks })))
      return response.data
    },
    enabled: !!id && !!user,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
  return { data: { board, columns }, isLoading, setColumns }
}

export const useGetBoards = () => {
  const { user } = useUser()

  return useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const response = await axios.get('/api/board/get-all', {
        headers: {
          'Content-Type': 'application/json',
        },
        params: { user_email: user?.emailAddresses[0].emailAddress },
      })
      return response.data
    },
    enabled: !!user,
    retry: 2,
    staleTime: 1000 * 60 * 60,
  })
}

export const useUpdateBoard = ({ id, title, color }: { id: string, title: string, color: string }) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['board-update', id],
    mutationFn: async () => {
      const response = await updateBoard({ board_id: id, title, color })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    }
  })
}

export const useCreateTask = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['task-create'],
    mutationFn: async (taskData: Omit<Task, '_id' | 'created_at' | 'updated_at'
      | 'sort_order'>) => {
      const response = await createTask(taskData)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    }
  })
}

export const useMoveTask = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['task-move'],
    mutationFn: async ({ task_id, column_id, sort_order }: { task_id: string, column_id: string, sort_order: number }) => {
      const response = await axios.put('/api/task/update', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { task_id, task: { column_id, sort_order } },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      queryClient.invalidateQueries({ queryKey: ['boards'] })

    }
  })
}

export const useCreateColumn = (id: string) => {
  const { user } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['column-create'],
    mutationFn: async ({ title, sort_order }: { title: string, sort_order: number }) => {
      const response = await axios.post('/api/column/create', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { title, sort_order, board_id: id, user_email: user?.emailAddresses[0].emailAddress },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      queryClient.invalidateQueries({ queryKey: ['boards'] })

    }
  })
}

export const useUpdateColumn = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['column-update'],
    mutationFn: async ({ column_id, title }: { column_id: string, title: string }) => {
      const response = await updateColumn({ column_id, title })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    }
  })
}

export const useDeleteColumn = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['column-delete'],
    mutationFn: async ({ column_id }: { column_id: string }) => {
      const response = await axios.delete('/api/column/delete', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { column_id },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', id] })
    }
  })
}
