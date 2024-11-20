import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

type DashboardProps = {
	children: any
	config: any
}

const Dashboard = ({ children, config }: DashboardProps) => {
	return (
		<SidebarProvider>
			<Sidebar collapsible='icon'> {config?.Sidebar({ navConf: config?.navConf })}</Sidebar>
			<SidebarInset>
				{config?.Header({})}
				{config?.Content({ children })}
			</SidebarInset>
		</SidebarProvider>
	)
}

export default Dashboard
