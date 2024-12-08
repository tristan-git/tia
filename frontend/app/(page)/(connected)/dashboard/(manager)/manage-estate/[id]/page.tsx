import MyEstates from './_section'

export default async function Estate({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id
	return (
		<>
			<div className='container max-w-screen-xl p-4 overflow-x-hidden'>
				<MyEstates idEstate={id as `0x${string}`} />
			</div>
		</>
	)
}
