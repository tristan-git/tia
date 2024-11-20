import { SidebarContent } from '@/components/ui/sidebar'
import DashboardSideBarGroup from './sideBarGroup'

type nameProps = { navConf }

const DashboardSideBarContent = ({ navConf }: nameProps) => {
	return (
		<>
			<SidebarContent>
				{navConf?.map(({ label, navMain }, i) => (
					<DashboardSideBarGroup key={`${label}-${i}`} label={label} navMain={navMain} />
				))}
			</SidebarContent>
		</>
	)
}

export default DashboardSideBarContent
