// import { DataTableToolbar } from './_sections/tableConf/toolBar'
// import CreateEstate from './_sections/createEstate'
// import { useGetManagerEstate } from '@/hooks/queries/manager/useGetManagerEstate'
// import { DataTable } from '@/components/shared/dataTable/data-table'
// import { columns } from './_sections/tableConf/columns'

import MyEstates from "./_section"

// const config = {
// 	DataTableToolbar: DataTableToolbar,
// 	useReactTable: { enableRowSelection: false },
// }

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VotesPage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function Estate({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id
	return (
		<div>
			My Post: {id}
			<MyEstates idEstate={id} />
		</div>
	)
}
