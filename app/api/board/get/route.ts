import { NextRequest, NextResponse } from "next/server"
import boardsModel from "@/lib/mongodb/models/boards.model"
import columnsModel from "@/lib/mongodb/models/columns.model"
import tasksModel from "@/lib/mongodb/models/tasks.model"


export async function GET(req: NextRequest) {
  try {
    const board_id = req.nextUrl.searchParams.get('board_id')
    if (!board_id) {
      return new NextResponse('Board ID is required', { status: 400 })
    }

    const board = await boardsModel.findOne({ _id: board_id })
    const columns = await columnsModel.find({ board_id })
    const tasks = await tasksModel.find({ column_id: { $in: columns.map((col) => col._id) } })
    const columnsWithTasks = columns.map((col) => ({ ...col, tasks: tasks.filter((task) => task.column_id.toString() === col._id.toString()) }))
    return NextResponse.json({ board, columnsWithTasks })
  } catch (error) {
    console.error('Error getting boards:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 