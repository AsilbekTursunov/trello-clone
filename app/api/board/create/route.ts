import { boardService, columnService } from "@/actions/index.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, user_email } = body

    if (!title) {
      return new NextResponse('Title is required', { status: 400 })
    }

    const newBoard = await boardService.createBoard({ title, user_email })
    const defaultColumns = [
      { title: 'To Do', sort_order: 0 },
      { title: 'In Progress', sort_order: 1 },
      { title: 'Review', sort_order: 2 },
      { title: 'Done', sort_order: 3 },
    ]

    await Promise.all(
      defaultColumns.map(column =>
        columnService.createColumn({ ...column, user_email, board_id: newBoard._id! })
      )
    )

    return NextResponse.json(newBoard)
  } catch (error) {
    console.error('Error creating board:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}