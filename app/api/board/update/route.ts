import boardsModel from "@/lib/mongodb/models/boards.model" 
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb/db"


export async function PUT(req: Request) {
  const body = await req.json() 
  try {
    connectDB() 
    const response = await boardsModel.findById(body.data.board_id)
    if (!response) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }
    response.title = body.data.title
    response.color = body.data.color
    await response.save()
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error updating board:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }


}