import { GalleryVerticalEnd, Sparkles } from 'lucide-react'

import { SidebarHeader, SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar'

type nameProps = {}

const DashboardSideBarHeader = ({}: nameProps) => {
	return (
		<>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
						{/* <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
							<Sparkles className='size-4' />
						</div>
						<div className='grid flex-1 text-left text-sm leading-tight'>
							<span className='truncate font-semibold'>Alyvote</span>
							<span className='truncate text-xs'>Voting management</span>
						</div> */}

						<a href='#' className='flex items-center gap-2 font-bold'>
						<div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
							<GalleryVerticalEnd className='size-4' />
						</div>
						TIA DIGITAL
					</a>
					</SidebarMenuButton>
				</SidebarMenu>
			</SidebarHeader>
		</>
	)
}

export default DashboardSideBarHeader
