'use client'
import Navbar from '@/components/navbar'
import React from 'react' 
import DashboardHero from './_components/hero'
import CreateSection from './_components/create-section'
import { PuffLoader } from 'react-spinners'
import { useData } from '@/data/useData'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
const Dashboard = () => {
	const { user } = useUser()
	const { isBoardsLoading, boards, getBaords } = useData()

	useEffect(() => {
		if (user) {
			getBaords(user?.emailAddresses[0].emailAddress!)
		}
	}, [user])
	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />
			{
				isBoardsLoading ? (
					<div className='flex justify-center items-center h-screen'>
						<PuffLoader color="#000" size={100} />
					</div>
				) : (
					<main className='container mx-auto px-4 py-6 sm:py-8'>
						<DashboardHero />
						<CreateSection data={boards} />
					</main>
				)
			}
		</div>
	)
}

export default Dashboard
