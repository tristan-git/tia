import { SquareTerminal } from 'lucide-react'
import { Share1Icon } from '@radix-ui/react-icons'

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
			label: 'Management des bien',
			roleAccess: 'manager',
			navMain: [
				{
					title: 'Réseaux immobilier',
					url: '/dashboard/manage-estate',
					icon: Share1Icon,
					// subNav: [
					// 	{ title: 'Votes', url: '/dashboard/votes' },
					// 	{ title: 'subnav2', url: '#' },
					// ],
				},
			],
		},

		/////////////////////////////////////////////////////////
		// ADMIN
		/////////////////////////////////////////////////////////

		{
			label: 'Administration',
			roleAccess: 'admin',
			navMain: [
				{
					title: 'utilisateurs',
					url: '/dashboard/manage-users',
					icon: SquareTerminal,
					// subNav: [
					// 	{ title: 'Votes', url: '/dashboard/votes' },
					// 	{ title: 'subnav2', url: '#' },
					// ],
				},
				{
					title: 'Assigner module',
					url: '/dashboard/admin-manage-estate',
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
