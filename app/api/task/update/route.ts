import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb/db"
import tasksModel from "@/lib/mongodb/models/tasks.model"
import { NextResponse } from "next/server"


export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { task_id, task } = body.data 
  try {
    connectDB()
    const updatedTask = await tasksModel.updateOne({ _id: task_id }, { $set: task })
    if (!updatedTask) {
      return NextResponse.json({ task: null })
    }
    return NextResponse.json({ task: updatedTask })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 