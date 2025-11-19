import tasksModel from "@/lib/mongodb/models/tasks.model";
import { connectDB } from "@/lib/mongodb/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, due_date, priority, assignee, column_id, description } = body.data
  console.log(body.data)
  try {
    connectDB()
    if (!title) {
      return new NextResponse('Title is required', { status: 400 })
    }

    const newTask = await tasksModel.create({ title, due_date, priority, assignee, column_id, description })

    return NextResponse.json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}