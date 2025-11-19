'use client'
import Navbar from "@/components/navbar";
import PageLoader from "@/components/PageLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBoard, useCreateColumn, useCreateTask, useMoveTask, useUpdateBoard, useUpdateColumn } from "@/hooks/useBoard";
import { ColumnWithTasks, Task } from "@/types";
import { Calendar, Loader2, MoreHorizontal, Plus, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { BarLoader } from "react-spinners";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getDate } from "@/lib/utils";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { updateColumn } from "@/actions/index.action";
import { usePlan } from "@/context/PlanContext";

function SortableTask({ task }: { task: Task }) {
  function getPriorityColor(priority: "low" | "medium" | "high"): string {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  })

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={styles}>
      <Card className="cursor-pointer px-0 hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {/* Task Header */}
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
                {task.title}
              </h4>
            </div>

            {/* Task Description */}
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description || "No description."}
            </p>

            {/* Task Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                {task.assignee && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span className="truncate">{task.assignee}</span>
                  </div>
                )}
                {task.due_date && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span className="truncate">{getDate(task.due_date)}</span>
                  </div>
                )}
              </div>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(
                  task.priority
                )}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function TaskOverlay({ task }: { task: Task }) {
  function getPriorityColor(priority: "low" | "medium" | "high"): string {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  }

  return (
    <Card className="cursor-pointer hover:shadow-md px-0 transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {/* Task Header */}
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
              {task.title}
            </h4>
          </div>

          {/* Task Description */}
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description || "No description."}
          </p>

          {/* Task Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              {task.assignee && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span className="truncate">{task.assignee}</span>
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span className="truncate">{getDate(task.due_date)}</span>
                </div>
              )}
            </div>
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(
                task.priority
              )}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DroppableColumn({
  column,
  children,
  setIsCreatingTask,
  onEditColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  setIsCreatingTask: () => void;
  onEditColumn: () => void;
}) {
  const { setNodeRef, isOver } = useSortable({
    id: column._id,
  })
  return (
    <div ref={setNodeRef} className={cn("w-full lg:flex-shrink-0 pt-2 lg:w-80", isOver && "bg-blue-50 rounded-lg")}>
      <div className={`bg-white rounded-lg shadow-sm border ${isOver ? "ring-2 ring-blue-300" : ""
        }`}>
        {/* Column Header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2  min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{column.title}</h3>
              <Badge variant="secondary" className="text-xs flex-shrink-0">{column.tasks.length}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
              onClick={onEditColumn}
            >
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        {/* Column Content */}
        <div className="p-2 space-y-2">
          {children}
          <Button
            variant="ghost"
            className="w-full mt-3 text-gray-500 hover:text-gray-700"
            onClick={setIsCreatingTask}
          >
            <Plus />
            Add Task
          </Button>
        </div>
      </div>
    </div>
  )
}



export default function BoardPage() {
  const params = useParams()
  const { data, isLoading, setColumns } = useBoard({ id: params.id as string })
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(
    null
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignee: [] as string[],
    dueDate: null as string | null,
  });


  // update board
  const { mutate: updateBoard, isPending: loading } = useUpdateBoard({ id: params.id as string, title: newTitle, color: newColor })

  // create task
  const { mutate: createTask, isPending: creatingTask } = useCreateTask(params.id as string)

  // move task
  const { mutate: moveTask, isPending: movingTask } = useMoveTask(params.id as string)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleFilterChange(
    type: "priority" | "assignee" | "dueDate",
    value: string | string[] | null
  ) {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  }

  async function handleCreateTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      due_date: (formData.get("due_date") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium",
      column_id: formData.get("column_id") as string,
      sort_order: data?.columns?.find((col: ColumnWithTasks) => col._id === formData.get("column_id"))?.tasks.length || 0,
    };

    if (taskData.title.trim()) {
      createTask(taskData);

      const trigger = document.querySelector(
        '[data-state="open"]'
      ) as HTMLElement;
      if (trigger) trigger.click();
    }
  }

  function handleOverStart(event: DragStartEvent) {
    const taskId = event.active.id
    console.log('taskId', taskId)
    const task = data?.columns?.flatMap((col: ColumnWithTasks) => col.tasks).find((task: Task) => task._id === taskId)
    if (task) {
      setActiveTask(task)
    }
  }

  function handleOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return
    const activeColumnId = active.id
    const overColumnId = over.id

    const sourceColumn = data?.columns?.find((col) =>
      col.tasks.some((task) => task._id === activeColumnId)
    );

    const targetColumn = data?.columns?.find((col) =>
      col.tasks.some((task) => task._id === overColumnId)
    );

    if (!sourceColumn || !targetColumn) return;


    if (sourceColumn._id === targetColumn._id) {
      const activeIndex = sourceColumn.tasks.findIndex(
        (task) => task._id === activeColumnId
      );

      const overIndex = targetColumn.tasks.findIndex(
        (task) => task._id === overColumnId
      );

      if (activeIndex !== overIndex) {
        // setColumns((prev) => {
        //   const newColumn = [...prev!]
        //   const column = newColumn.find((col) => col._id === activeColumnId)
        //   if (column) {
        //     const tasks = [...column.tasks]
        //     const task = tasks.find((task) => task._id === activeColumnId)
        //     if (task) {
        //       tasks.splice(activeIndex, 1)
        //       tasks.splice(overIndex, 0, task)
        //     }
        //     column.tasks = tasks
        //   }
        //   return newColumn
        // });
      }
    }
  }

  async function handleOverEnd(event: DragEndEvent) {
    const { active, over } = event

    const taskId = active.id as string
    const overId = over?.id as string
    const targetColumn = data?.columns?.find((col) => col._id === overId)
    if (targetColumn) {
      const sourceColumn = data?.columns?.find((col) =>
        col.tasks.some((task) => task._id === taskId)
      );

      if (sourceColumn && sourceColumn._id !== targetColumn._id) {
        moveTask({ task_id: taskId, column_id: targetColumn._id, sort_order: targetColumn.tasks.length });
      }
    } else {
      const sourceColumn = data?.columns?.find((col) =>
        col.tasks.some((task) => task._id === taskId)
      );

      const targetColumn = data?.columns?.find((col) =>
        col.tasks.some((task) => task._id === overId)
      );

      if (sourceColumn && targetColumn) {
        const oldIndex = sourceColumn.tasks.findIndex((task) => task._id === taskId);

        const newIndex = targetColumn.tasks.findIndex((task) => task._id === overId)

        if (oldIndex !== newIndex) {
          const newColumns = data?.columns?.map((col: ColumnWithTasks) => ({
            ...col,
            tasks: col.tasks.map((task) => {
              if (task._id === taskId) {
                // Drag qilingan task -> yangi joyga o‘tadi
                return { ...task, column_id: targetColumn._id, sort_order: newIndex };
              }
              if (task._id === overId) {
                // Target task -> eski joyga o‘tadi
                return { ...task, sort_order: oldIndex };
              }
              return task;
            }),
          }));

          setColumns(newColumns!);
          moveTask({ task_id: taskId, column_id: targetColumn._id, sort_order: newIndex });
        }
      }
    }
  }

  const { mutate: createColumn, isPending: creatingColumn } = useCreateColumn(params.id as string)
  const { mutate, isPending: updatingColumn } = useUpdateColumn(params.id as string)

  function handleCreateColumn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('columnTitle') as string
    createColumn({ title, sort_order: data?.columns?.length || 0 })
    setIsCreatingColumn(false)
  }

  async function handleEditColumn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await updateColumn({ column_id: editingColumn?._id as string, title: editingColumnTitle })
    setIsEditingColumn(false)
  }

  function clearFilters() {
    setFilters({
      priority: [] as string[],
      assignee: [] as string[],
      dueDate: null as string | null,
    });
  }


  const filterdColumnTasks = data?.columns?.map((col: ColumnWithTasks) => ({
    ...col,
    tasks: col.tasks.filter((task: Task) => {
      if (filters.priority.length > 0) {
        return filters.priority.includes(task.priority)
      }
      if (filters.dueDate) {
        return task.due_date === filters.dueDate
      }
      return true
    }),
  }))


  if (isLoading) return <PageLoader />

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        boardTitle={data?.board?.title}
        onEditBoard={() => {
          setNewTitle("Board Title");
          setNewColor("#fff");
          setIsEditingTitle(true);
        }}
        onFilterClick={() => setIsFilterOpen(true)}
        filterCount={Object.values(filters).reduce(
          (count, v) =>
            count + (Array.isArray(v) ? v.length : v !== null ? 1 : 0),
          0
        )}
      />

      {/* Board Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Total Tasks: </span>
              {data && data.columns?.reduce((sum: number, col: ColumnWithTasks) => sum + col.tasks.length, 0)}
            </div>
          </div>



          {/* Add task dialog */}
          <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask} >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <p className="text-sm text-gray-600">
                  Add a task to the board
                </p>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleCreateTask}>
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter task title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Input
                    id="assignee"
                    name="assignee"
                    placeholder="Who should do this?"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="space-y-2 w-full">
                    <Label>Priority</Label>
                    <Select name="priority" defaultValue="medium" >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["low", "medium", "high"].map((priority, key) => (
                          <SelectItem key={key} value={priority}>
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 w-full">
                    <Label>Column</Label>
                    <Select name="column_id" defaultValue={data?.columns?.[0]?._id.toString()}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {data?.columns?.map((col: ColumnWithTasks, key: number) => (
                          <SelectItem key={key} value={col._id.toString()}>
                            {col.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" id="due_date" name="due_date" />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="submit">
                    {creatingTask ? <BarLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Create Task'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* Columns */}
        <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleOverStart} onDragOver={handleOver} onDragEnd={handleOverEnd}>
          <div className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto 
            lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 
            lg:[&::-webkit-scrollbar-track]:bg-gray-100 
            lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full 
            space-y-4 lg:space-y-0">

            {filterdColumnTasks?.map((column: ColumnWithTasks) => (
              <DroppableColumn
                key={column._id}
                column={column}
                setIsCreatingTask={() => setIsCreatingTask(true)}
                onEditColumn={() => {
                  setEditingColumn(column)
                  setIsEditingColumn(true)
                }}
              >
                <SortableContext items={column.tasks.map((task: Task) => task._id)} strategy={verticalListSortingStrategy} >
                  {column.tasks.sort((a, b) => a.sort_order - b.sort_order).map((task: Task, key: number) => (
                    <SortableTask key={key} task={task} />
                  ))}
                </SortableContext>
              </DroppableColumn>
            ))}
            <div className="w-full lg:flex-shrink-0 lg:w-80">
              <Button
                variant="outline"
                className="w-full h-full min-h-[200px] border-dashed border-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsCreatingColumn(true)}
              >
                <Plus />
                Add another list
              </Button>
            </div>
            <DragOverlay>
              {activeTask && (
                <TaskOverlay task={activeTask} />
              )}
            </DragOverlay>
          </div>
        </DndContext>
      </main>

      <Dialog open={isCreatingColumn} onOpenChange={setIsCreatingColumn}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Column</DialogTitle>
            <p className="text-sm text-gray-600">
              Add new column to organize your tasks
            </p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={newColumnTitle}
                name="columnTitle"
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Enter column title..."
                required
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                onClick={() => setIsCreatingColumn(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit">{creatingColumn ? 'Creating...' : 'Create Column'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditingColumn} onOpenChange={setIsEditingColumn}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Column title</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEditColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={editingColumnTitle}
                name="columnTitle"
                onChange={(e) => setEditingColumnTitle(e.target.value)}
                placeholder="Enter column title..."
                required
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                onClick={() => setIsEditingColumn(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit">{updatingColumn ? 'Editing...' : 'Edit Column'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" >
            <div className="space-y-2">
              <Label htmlFor="boardTitle">Board Title</Label>
              <Input
                id="boardTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter board title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Board Color</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-purple-500",
                  "bg-pink-500",
                  "bg-indigo-500",
                  "bg-gray-500",
                  "bg-orange-500",
                  "bg-teal-500",
                  "bg-cyan-500",
                  "bg-emerald-500",
                ].map((color, key) => (
                  <button
                    key={key}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color} ${color === newColor
                      ? "ring-2 ring-offset-2 ring-gray-900"
                      : ""
                      } `}
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingTitle(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => updateBoard()} type="button">
                {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
            <p className="text-sm text-gray-600">
              Filter tasks by priority, assignee, or due date
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex flex-wrap gap-2">
                {["low", "medium", "high"].map((priority, key) => (
                  <Button
                    onClick={() => {
                      const newPriorities = filters.priority.includes(
                        priority
                      )
                        ? filters.priority.filter((p) => p !== priority)
                        : [...filters.priority, priority];

                      handleFilterChange("priority", newPriorities);
                    }}
                    key={key}
                    variant={
                      filters.priority.includes(priority)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="capitalize"
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={filters.dueDate || ""}
                onChange={(e) =>
                  handleFilterChange("dueDate", e.target.value || null)
                }
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant={"outline"}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
              <Button type="button" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
} 