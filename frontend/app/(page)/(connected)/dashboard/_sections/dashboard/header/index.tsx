'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/provider/theme-provider/ModeToogle'
import { usePathname } from 'next/navigation'
import React from 'react'

const pathToNameMap: Record<string, string> = {
	'/dashboard': 'Dashboard',
	'/dashboard/votes': 'Votes',
	'/dashboard/network-estate': 'Réseaux immobiliers',
	'/dashboard/all-estates': 'Propriété foncière',
	'/dashboard/all-documents': 'Documents',
	'/dashboard/all-interventions': 'Interventions',
}

const DashboardHeader = () => {
	const pathname = usePathname()

	// Transformer le chemin en segments pour construire les breadcrumbs
	const pathSegments = pathname
		?.split('/')
		.filter((segment) => segment) // Supprime les segments vides
		.map((segment, index, array) => ({
			path: `/${array.slice(0, index + 1).join('/')}`, // Chemin cumulé
			name: pathToNameMap[`/${array.slice(0, index + 1).join('/')}`] || segment, // Nom ou segment brut
		}))

	return (
		<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
			<div className='flex items-center gap-2 px-4 justify-between w-full'>
				<div className='flex items-center gap-2 px-4'>
					<SidebarTrigger className='-ml-1' />
					<Separator orientation='vertical' className='mr-2 h-4' />
					<Breadcrumb>
						<BreadcrumbList>
							{pathSegments?.map((segment, index) => (
								<React.Fragment key={segment.path}>
									<BreadcrumbItem>
										<BreadcrumbLink>{segment.name}</BreadcrumbLink>
									</BreadcrumbItem>

									{index < pathSegments.length - 1 && <BreadcrumbSeparator />}
								</React.Fragment>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<ModeToggle />
			</div>
		</header>
	)
}

export default DashboardHeader
