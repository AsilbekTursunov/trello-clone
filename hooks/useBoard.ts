'use client'
import { useUser } from "@clerk/nextjs"
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"


export const useBoard = ({ id }: { id: string }) => {
  const { user } = useUser()

  return useQuery({
    queryKey: ['board', id],
    queryFn: async () => {
      const response = await axios.get('/api/board/get', {
        headers: {
          'Content-Type': 'application/json',
        },
        params: { board_id: id },
      })
      return response.data
    },
    enabled: !!id && !!user,
    staleTime: 1000 * 60 * 60,
  })
}


export const useGetBoards = () => {
  const { user } = useUser()

  return useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const response = await axios.post('/api/board/get-all', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { user_email: user?.emailAddresses[0].emailAddress },
      })
      return response.data
    },
    enabled: !!user,
    retry: 2,
    staleTime: 1000 * 60 * 60,
  })
}


export const useUpdateBoard = ({ id, body }: { id: string, body?: any }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['board-update', id],
    mutationFn: async () => {
      const response = await axios.put('/api/board/update', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: { board_id: id, ...body }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', id] })
    }
  })
}