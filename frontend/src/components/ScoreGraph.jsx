export default function ScoreGraph({ scores }) {
	const categories = Object.keys(scores);
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{categories.map((category) => (
				<div key={category}>
					<h4 className="text-lg font-medium">{category}</h4>
					<div className="w-full bg-gray-200 rounded-full h-4">
						<div
							className="bg-blue-600 h-4 rounded-full"
							style={{ width: `${scores[category]}%` }}
						></div>
					</div>
					<p className="mt-1 text-sm text-gray-400">{scores[category]} / 100</p>
				</div>
			))}
		</div>
	);
}
