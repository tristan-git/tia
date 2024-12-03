// import { DataTableToolbar } from './_sections/tableConf/toolBar'
// import CreateEstate from './_sections/createEstate'
// import { useGetManagerEstate } from '@/hooks/queries/manager/useGetManagerEstate'
// import { DataTable } from '@/components/shared/dataTable/data-table'
// import { columns } from './_sections/tableConf/columns'

// const config = {
// 	DataTableToolbar: DataTableToolbar,
// 	useReactTable: { enableRowSelection: false },
// }

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VotesPage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function Estate({ params }: { params: Promise<{ id: string }> }) {
	const slug = (await params).id
	return <div>My Post: {slug}</div>
}
