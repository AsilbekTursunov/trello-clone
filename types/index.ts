export interface Board {
  _id: string
  title: string
  description: string | null
  color: string
  user_email: string 
  created_at: string
  updated_at: string
}

export interface Column {
  _id: string
  board_id: string
  title: string
  sort_order: number
  created_at: string
  user_email: string
  updated_at: string
}

export type ColumnWithTasks = Column & {
  tasks: Task[]
}

export interface Task {
  _id: string
  column_id: string
  title: string
  description: string | undefined
  assignee: string | undefined
  due_date: string | undefined
  priority: 'low' | 'medium' | 'high'
  sort_order: number
  created_at: string
  updated_at: string
}
