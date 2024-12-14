import { ChevronRight } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

type nameProps = { label?: string; navMain: any }

const DashboardSideBarGroup = ({ label, navMain }: nameProps) => {
	return (
		<>
			<SidebarGroup>
				{label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
				<SidebarMenu>
					{navMain.map((item) =>
						item?.subNav ? (
							<Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.subNav?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<Link href={item.url}>
														<SidebarMenuSubButton asChild>{item.title}</SidebarMenuSubButton>
													</Link>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						) : (
							<SidebarMenuItem key={item.title}>
								{' '}
								<Link href={item.url}>
									<SidebarMenuButton className=''>
										{item.icon && <item.icon />}
										{item.title}
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						)
					)}
				</SidebarMenu>
			</SidebarGroup>
		</>
	)
}

export default DashboardSideBarGroup
