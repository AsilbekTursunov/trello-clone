import boardsModel from "@/lib/mongodb/models/boards.model"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest) {
  try {
    const board_id = req.nextUrl.searchParams.get('board_id')
    if (!board_id) {
      return new NextResponse('Board ID is required', { status: 400 })
    }

    const board = await boardsModel.findByIdAndDelete(board_id)
    return NextResponse.json(board)
  } catch (error) {
    console.error('Error deleting board:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}