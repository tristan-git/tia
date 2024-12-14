'use client'

import { Share1Icon } from '@radix-ui/react-icons'

import Dashboard from '@/components/shared/dashboard'
import DashboardContent from './_sections/dashboard/content'
import DashboardSideBar from './_sections/dashboard/sideBar'
import DashboardHeader from './_sections/dashboard/header'
import { CubeIcon, PersonIcon, FileIcon, ClipboardIcon, HomeIcon } from '@radix-ui/react-icons'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
			navMain: [
				{
					title: 'Réseaux immobilier',
					url: '/dashboard/network-estate',
					icon: Share1Icon,
				},
				{
					title: 'Propriété foncière',
					url: '/dashboard/all-estates',
					icon: HomeIcon,
				},
				{
					title: 'Interventions',
					url: '/dashboard/all-interventions',
					icon: ClipboardIcon,
				},
				{
					title: 'Documents',
					url: '/dashboard/all-documents',
					icon: FileIcon,
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
					title: 'Authorisations module',
					url: '/dashboard/admin-module',
					icon: CubeIcon,
				},
				{
					title: 'utilisateurs',
					url: '/dashboard/manage-users',
					icon: PersonIcon,
				},
			],
		},
	],
}

/////////////////////////////////////////////////////////
// Component
/////////////////////////////////////////////////////////

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()

	useEffect(() => {
		localStorage.setItem('targetRoute', pathname)
	}, [pathname])
	return <Dashboard config={dashboardConfig}>{children}</Dashboard>
}
