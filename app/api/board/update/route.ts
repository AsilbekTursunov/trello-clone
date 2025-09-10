import boardsModel from "@/lib/mongodb/models/boards.model"
import { NextResponse } from "next/server"


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()
  try {
    const response = await boardsModel.findById(id)
    if (!response) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }
    response.title = body.title
    response.color = body.color
    await response.save()
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error updating board:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }


}