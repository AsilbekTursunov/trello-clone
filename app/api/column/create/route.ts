import { createColumn } from '@/actions/index.action'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, user_email, board_id, sort_order } = body.data

    if (!title) {
      return new NextResponse('Title is required', { status: 400 })
    }

    const newColumn = await createColumn({ title, user_email, board_id, sort_order })
    return NextResponse.json(newColumn)
  } catch (error) {
    console.error('Error creating column:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}