'use client'
import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { Filter, Grid3x3, List, Loader2, Plus, Rocket, Search, Trello } from 'lucide-react'
import React, { useState } from 'react'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useGetBoards } from '@/hooks/useBoard'
import { Board } from '@/types'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DialogHeader, Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import moment from 'moment'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const Dashboard = () => {
	const { user } = useUser()
	const router = useRouter()
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
	const { data } = useGetBoards()
	const isFreeUser = false
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const queryClient = useQueryClient()
	const [boards, setBoards] = useState<Board[]>(data?.boards || [])


	// create board
	const { mutate: createBoard, isPending: loading } = useMutation({
		mutationKey: ['create-board'],
		mutationFn: async (title: string) => {
			const response = await axios.post('/api/board/create', { title, user_email: user?.emailAddresses[0].emailAddress })

			return response.data
		}, onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['boards'] })
			console.log('data', data)
			setBoards([...boards, data])
		}
	})

	const canCreateBoard = !isFreeUser || boards && boards.length < 2;

	const boardsWithTaskCount = boards && boards.map((board: Board) => ({
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
		createBoard('New Board')
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

	// if (loading) return <Loader2 className="animate-spin" />
	// console.log('boards', boards)
	// console.log('user', user)

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />

			<main className='container mx-auto px-4 py-6 sm:py-8'>
				<div className='mb-6 sm:mb-8'>
					<h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
						Welcome back, {user?.firstName ?? user?.emailAddresses[0].emailAddress}! 👋
					</h1>
					<p className='text-gray-600'>Here's what's happening with your boards today.</p>
				</div>
				{/* Stats */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
					<Card className='p-0'>
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs sm:text-sm font-medium text-gray-600">
										Total Boards
									</p>
									<p className="text-xl sm:text-2xl font-bold text-gray-900">
										{boards?.length}
									</p>
								</div>
								<div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
									<Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className='p-0'>
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs sm:text-sm font-medium text-gray-600">
										Active Projects
									</p>
									<p className="text-xl sm:text-2xl font-bold text-gray-900">
										{boards?.length}
									</p>
								</div>
								<div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
									<Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className='p-0'>
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs sm:text-sm font-medium text-gray-600">
										Recent Activity
									</p>
									<p className="text-xl sm:text-2xl font-bold text-gray-900">
										{
											boards?.filter((board: Board) => {
												const updatedAt = new Date(board.updated_at);
												const oneWeekAgo = new Date();
												oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
												return updatedAt > oneWeekAgo;
											}).length
										}
									</p>
								</div>
								<div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center">
									📊
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className='p-0'>
						<CardContent className="p-4 sm:p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs sm:text-sm font-medium text-gray-600">
										Total Boards
									</p>
									<p className="text-xl sm:text-2xl font-bold text-gray-900">
										{boards?.length}
									</p>
								</div>
								<div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
									<Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="mb-6 sm:mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
						<div>
							<h2 className="text-xl sm:text-2xl font-bold text-gray-900">
								Your Boards
							</h2>
							<p className="text-gray-600">Manage your projects and tasks</p>
							{isFreeUser && (
								<p className="text-sm text-gray-500 mt-1">
									Free plan: {boards?.length}/1 boards used
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
			</main>

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
		</div>
	)
}

export default Dashboard
