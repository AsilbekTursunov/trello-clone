'use client'
import Navbar from "@/components/navbar";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoard, useUpdateBoard } from "@/hooks/useBoard";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";




export default function BoardPage() {
  const params = useParams()
  const { data: board, isLoading, error } = useBoard({ id: params.id as string })

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  // const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(
  //   null
  // );

  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignee: [] as string[],
    dueDate: null as string | null,
  });

  const { mutate: updateBoard, isPending: loading } = useUpdateBoard({ id: params.id as string, body: { title: newTitle, color: newColor }})

  if (isLoading) return <PageLoader />

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        boardTitle={board?.title}
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

    </div>
  )
} 