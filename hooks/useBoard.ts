'use client'
import { useUser } from "@clerk/nextjs"
import axios from 'axios'
import { useQuery, useMutation } from "@tanstack/react-query"


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
      const response = await axios.get('/api/board/get-all', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    },
    enabled: !!user,
    retry: 2,
    staleTime: 1000 * 60 * 60,
  })
}


export const useUpdateBoard = ({ id, type = "get", body }: { id: string, type: string, body?: any }) => {
  const { user } = useUser()

  return useMutation({
    mutationKey: ['board', id],
    mutationFn: async () => {
      const response = await axios.put('/api/board/update', {
        headers: {
          'Content-Type': 'application/json',
        },
        params: { board_id: id },
      })
      return response.data
    },
  })
}