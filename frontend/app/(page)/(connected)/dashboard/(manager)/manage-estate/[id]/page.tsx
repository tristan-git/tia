import MyEstates from './_section'

export default async function Estate({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id
	return (
		<div>
			My Post: {id}
			<MyEstates idEstate={id} />
		</div>
	)
}
