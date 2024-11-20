type nameProps = { children?: React.ReactNode }

const DashboardContent = ({ children }: nameProps) => {
	return <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
}

export default DashboardContent
