export default function Scoreboard({ sites }) {
	console.log(sites);
	return (
		<div className="space-y-8">
			<h2 className="text-4xl font-semibold mb-6">Top 100 Scoreboard</h2>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-neutral-800 rounded-xl">
					<thead>
						<tr className="border-b border-neutral-700">
							<th className="text-left py-5 px-6 text-neutral-400 font-medium text-xl w-16">
								Rank
							</th>
							<th className="text-left py-5 px-6 text-neutral-400 font-medium text-xl">
								Site
							</th>
							<th className="text-right py-5 px-6 text-neutral-400 font-medium text-xl">
								Score
							</th>
						</tr>
					</thead>
					<tbody>
						{sites.map((site, index) => (
							<tr
								key={index}
								className="border-b border-neutral-700/50 last:border-0 hover:bg-neutral-700/20 transition-colors"
							>
								<td className="py-5 px-6 text-lg font-medium text-neutral-400">
									#{index + 1}
								</td>
								<td className="py-5 px-6 text-lg">
									<a
										href={`https://${site.url}`}
										target="_blank"
										rel="noopener noreferrer"
										className="hover:text-blue-400 transition-colors"
									>
										{site.url}
									</a>
								</td>
								<td className="py-5 px-6 text-right text-lg">
									<span
										className={`font-bold ${
											site.score >= 80
												? "text-green-400"
												: site.score >= 70
												? "text-blue-400"
												: site.score >= 60
												? "text-yellow-400"
												: "text-red-400"
										}`}
									>
										{parseFloat(site.score).toFixed(1)}
									</span>
									<span className="text-neutral-400 ml-1">/ 100</span>
								</td>
							</tr>
						))}
						{sites.length === 0 && (
							<tr>
								<td
									colSpan={3}
									className="py-8 px-6 text-center text-neutral-500"
								>
									No sites rated yet
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
