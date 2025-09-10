import { NextRequest, NextResponse } from "next/server"
import boardsModel from "@/lib/mongodb/models/boards.model"


export async function GET(req: NextRequest) {
  try {
    const board_id = req.nextUrl.searchParams.get('board_id')
    if (!board_id) {
      return new NextResponse('Board ID is required', { status: 400 })
    }

    const board = await boardsModel.findOne({ _id: board_id })
    return NextResponse.json(board)
  } catch (error) {
    console.error('Error getting boards:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 