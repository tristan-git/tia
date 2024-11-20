import { SquareTerminal } from 'lucide-react'

import Dashboard from '@/components/shared/dashboard'
import DashboardContent from './_sections/dashboard/content'
import DashboardSideBar from './_sections/dashboard/sideBar'
import DashboardHeader from './_sections/dashboard/header'

/////////////////////////////////////////////////////////
// dashboard Config
/////////////////////////////////////////////////////////

const dashboardConfig = {
	Sidebar: DashboardSideBar,
	Header: DashboardHeader,
	Content: DashboardContent,
	navConf: [
		{
			label: 'Voting management',
			navMain: [
				{
					title: 'Votes',
					url: '/dashboard/votes',
					icon: SquareTerminal,
					// subNav: [
					// 	{ title: 'Votes', url: '/dashboard/votes' },
					// 	{ title: 'subnav2', url: '#' },
					// ],
				},
			],
		},
		// {
		// 	label: 'Block explorer',
		// 	navMain: [
		// 		{
		// 			title: 'event ChestOpened',
		// 			url: '/dashboard/viem',
		// 			icon: SquareTerminal,
		// 		},
		// 	],
		// },
	],
}

/////////////////////////////////////////////////////////
// Component
/////////////////////////////////////////////////////////

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return <Dashboard config={dashboardConfig}>{children}</Dashboard>
}
