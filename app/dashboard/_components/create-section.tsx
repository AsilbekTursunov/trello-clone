'use client'
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Board } from '@/types'
import { Button } from '@/components/ui/button'
import { Filter, Grid3x3, List, Loader2, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import moment from 'moment'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { createBoard } from '@/actions/index.action'
import { usePlan } from '@/context/PlanContext'
import { useData } from '@/data/useData'

const CreateSection = ({ data }: { data: any }) => {
  const { user } = useUser()
  const router = useRouter()
  const { boards } = useData()
  const [showUpgradeDialog, setShowUpgradeDialog] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    search: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    },
    taskCount: {
      min: null as number | null,
      max: null as number | null,
    },
  });
  const { isFreeUser } = usePlan()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const queryClient = useQueryClient()

  // create board
  const { mutate: createNewBoard, isPending: loading } = useMutation({
    mutationKey: ['create-board'],
    mutationFn: async (title: string) => {
      const response = await createBoard({ title, user_email: user?.emailAddresses[0].emailAddress! })
      return response.data
    }, onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      console.log('data', data)
    }
  })

  const canCreateBoard = !isFreeUser || boards?.length! < 3;

  const boardsWithTaskCount = boards && boards?.map((board: Board) => ({
    ...board,
    taskCount: 0, // This would need to be calculated from actual data
  }));

  const filteredBoards = boardsWithTaskCount && boardsWithTaskCount.filter((board: Board) => {
    const matchesSearch = board.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesDateRange =
      (!filters.dateRange.start ||
        new Date(board.created_at) >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end ||
        new Date(board.created_at) <= new Date(filters.dateRange.end));

    return matchesSearch && matchesDateRange;
  });

  const handleCreateBoard = async () => {
    if (!canCreateBoard) {
      setShowUpgradeDialog(true);
      return;
    }
    createNewBoard('New Board')
  }

  function clearFilters() {
    setFilters({
      search: "",
      dateRange: {
        start: null as string | null,
        end: null as string | null,
      },
      taskCount: {
        min: null as number | null,
        max: null as number | null,
      },
    });
  } 
  return (
    <>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Your Boards
            </h2>
            <p className="text-gray-600">Manage your projects and tasks</p>
            {isFreeUser && (
              <p className="text-sm text-gray-500 mt-1">
                Free plan: {boards?.length}/3 boards used
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 justify-end">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter />
                Filter
              </Button>
            </div>

            <Button disabled={loading} onClick={handleCreateBoard} className='flex items-center'>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>
                <Plus />
              </>}
              Create Board
            </Button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Search boards..."
            className="pl-10"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        {/* Boards Grid/List */}
        {boards?.length === 0 ? (
          <div>No boards yet</div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredBoards?.map((board: Board, key: number) => (
              <Link href={`/boards/${board._id}`} key={board._id} className='flex'>
                <Card className="hover:shadow-lg gap-3 p-4 flex-1 bg-white transition-shadow cursor-pointer group">
                  <CardHeader className="p-0">
                    <div className="flex items-center justify-between">
                      <div className={`w-4 h-4 ${board.color} rounded`} />
                      <Badge className="text-xs" variant="secondary">
                        New
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className=" p-0 flex-1">
                    <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {board.title}
                    </CardTitle>
                    <CardDescription className="text-sm mb-4">
                      {board.description}
                    </CardDescription>

                  </CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs gap-3 text-gray-500 space-y-1 sm:space-y-0">
                    <span>
                      Created{" "}
                      {moment(board.created_at).format('DD-MM-YYYY')}
                    </span>
                    <span>
                      Updated{" "}
                      {moment(board.updated_at).format('DD-MM-YYYY')}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
            {loading &&
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <Skeleton className="h-full w-full rounded-xl" />
                </CardContent>
              </Card>}

            <Card onClick={handleCreateBoard} className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                  Create new board
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            {boards?.map((board: Board, key: number) => (
              <div key={board._id} className={key > 0 ? "" : ""}>
                <Link href={`/boards/${board._id}`}>
                  <Card className="hover:shadow-lg gap-3 p-4 transition-shadow cursor-pointer group">
                    <CardHeader className="p-0">
                      <div className="flex items-center justify-between">
                        <div className={`w-4 h-4 ${board.color} rounded`} />
                        <Badge className="text-xs" variant="secondary">
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {board.title}
                      </CardTitle>
                      <CardDescription className="text-sm mb-4">
                        {board.description}
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-gray-500 space-y-1 sm:space-y-0">
                        <span>
                          Created{" "}
                          {moment(board.created_at).format('DD-MM-YYYY')}
                        </span>
                        <span>
                          Updated{" "}
                          {moment(board.updated_at).format('DD-MM-YYYY')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}

            <Card className="mt-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                  Create new board
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Filter Boards</DialogTitle>
            <p className="text-sm text-gray-600">
              Filter boards by title, date, or task count.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                id="search"
                placeholder="Search board titles..."
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Start Date</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: e.target.value || null,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">End Date</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          end: e.target.value || null,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Task Count</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Minimum</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Min tasks"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        taskCount: {
                          ...prev.taskCount,
                          min: e.target.value ? Number(e.target.value) : null,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Maximum</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Max tasks"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        taskCount: {
                          ...prev.taskCount,
                          max: e.target.value ? Number(e.target.value) : null,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between pt-4 space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Upgrade to Create More Boards</DialogTitle>
            <p className="text-sm text-gray-600">
              Free users can only create one board. Upgrade to Pro or Enterprise
              to create unlimited boards.
            </p>
          </DialogHeader>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => router.push("/pricing")}>View Plans</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateSection