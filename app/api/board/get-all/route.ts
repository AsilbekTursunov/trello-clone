import { NextRequest, NextResponse } from "next/server"
import boardsModel from "@/lib/mongodb/models/boards.model"
import { connectDB } from "@/lib/mongodb/db"

export async function GET(req: NextRequest) {
  const user_email = req.nextUrl.searchParams.get('user_email')
  try {
    connectDB()
    const boards = await boardsModel.find({ user_email })
    if (!boards) {
      return NextResponse.json({ boards: [] })
    }
    return NextResponse.json({ boards })
  } catch (error) {
    console.error('Error getting boards:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}