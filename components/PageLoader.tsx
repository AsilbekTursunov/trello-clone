import { Loader2 } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
	return (
		<div className='flex items-center justify-center h-screen'>
			<Loader2 className="animate-spin" />
		</div>
	)
}

export default PageLoader