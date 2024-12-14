import { SidebarContent } from '@/components/ui/sidebar'
import DashboardSideBarGroup from './sideBarGroup'
import { useContext } from 'react'
import { BlockchainContext } from '@/components/provider/blockchainProvider'

type nameProps = { navConf }

const DashboardSideBarContent = ({ navConf }: nameProps) => {
	const { userAccount } = useContext(BlockchainContext)

	return (
		<SidebarContent>
			{navConf?.map(({ label, navMain, roleAccess }, i) => {
				if (roleAccess && roleAccess == userAccount?.roleName && label == 'Administration') {
					return <DashboardSideBarGroup key={`${label}-${i}`} label={label} navMain={navMain} />
				} else if (label !== 'Administration') {
					return <DashboardSideBarGroup key={`${label}-${i}`} label={label} navMain={navMain} />
				}
			})}
		</SidebarContent>
	)
}

export default DashboardSideBarContent
