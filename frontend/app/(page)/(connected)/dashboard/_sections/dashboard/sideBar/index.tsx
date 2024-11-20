import DashboardSideBarHeader from './header'
import DashboardSideBarFooter from './footer'
import DashboardSideBarContent from './content'

type nameProps = { navConf: any }

const DashboardSideBar = ({ navConf }: nameProps) => {
	return (
		<>
			<DashboardSideBarHeader />
			<DashboardSideBarContent navConf={navConf} />
			<DashboardSideBarFooter />
		</>
	)
}

export default DashboardSideBar
