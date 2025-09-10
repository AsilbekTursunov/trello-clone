import { NextRequest, NextResponse } from "next/server"
import boardsModel from "@/lib/mongodb/models/boards.model"

export async function GET(req: NextRequest) {
  try {
    const boards = await boardsModel.find()
    if (!boards) {
      return NextResponse.json({ boards: [] })
    }
    return NextResponse.json({ boards })
  } catch (error) {
    console.error('Error getting boards:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}